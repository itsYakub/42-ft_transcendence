import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs";
import { validJWT } from "./jwt.js";
import { User } from "../user/User.js";

export class DB {
	private db: DatabaseSync;

	constructor(dropUsers: boolean, dropMatches: boolean, dropViews: boolean) {
		this.db = new DatabaseSync(process.env.DB);
		this.initDB(dropUsers, dropMatches, dropViews);
		console.log("Set up db");
	}

	initDB(dropUsers: boolean, dropMatches: boolean, dropViews: boolean): void {
		this.initUsers(dropUsers);
		this.initMatches(dropMatches);
		this.initViews(dropViews);
		if (dropViews)
			this.fillViews();
	}

	initUsers(dropTables: boolean): void {
		if (dropTables)
			this.db.exec(`DROP TABLE IF EXISTS Users;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Nick TEXT UNIQUE NOT NULL,
      Email TEXT UNIQUE NOT NULL,
	  Avatar TEXT NOT NULL,
      Password TEXT,
	  Role TEXT NOT NULL,
	  Online INTEGER NOT NULL
    );`);
	}

	initMatches(dropTables: boolean): void {
		if (dropTables)
			this.db.exec(`DROP TABLE IF EXISTS Matches;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Matches (
      MatchID INTEGER PRIMARY KEY AUTOINCREMENT,
      P1ID INTEGER NOT NULL,
	  P2ID INTEGER NOT NULL,
      P1Score INTEGER NOT NULL,
	  P2Score INTEGER NOT NULL,
      PlayedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`);
	}

	initViews(dropTables: boolean): void {
		if (dropTables)
			this.db.exec(`DROP TABLE IF EXISTS Views;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Views (
      ViewName TEXT PRIMARY KEY,
	  Content BLOB
    );`);
	}

	fillViews(): void {
		const __dirname = import.meta.dirname;

		const views = ["frame", "friends", "home", "matches", "navbar_logged_in", "navbar_logged_out", "play", "profile", "tournament"];

		views.forEach((value) => {
			readFile(__dirname + `/views/${value}`, 'utf8', (err, data) => {
				if (err) {
					console.error(err);
					return;
				}
				//data = data.replaceAll("\n", "");
				data = data.replaceAll("\t", "");
				const hashed = btoa(data);
				const insert = this.db.prepare('INSERT INTO Views (ViewName, Content) VALUES (?, ?)');
				insert.run(value, hashed);
			});
		});
	}

	getFrame(): string {
		return this.getView("frame");
	}

	getNavbar(loggedIn: boolean): string {
		return loggedIn ? this.getView("navbar_logged_in") : this.getView("navbar_logged_out");
	}

	getView(viewName: string): string {
		const select = this.db.prepare("SELECT * FROM Views WHERE ViewName = ?");
		const view = select.get(viewName);
		return atob(view.Content as string);
	}

	getFrameView(viewName: string): any {
		const frame = this.getFrame();
		const content = this.getView(viewName);
		return {
			frame,
			content
		};
	}

	getUser(jwt: string) {
		const valid = validJWT(jwt);
		if (valid) {
			let payload = jwt.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			let date = new Date(exp);
			if (date < new Date()) {
				return {
					"error": true,
					"message": "Expired token!"
				}
			}
			const select = this.db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					"error": true,
					"message": "User not found!"
				}
			}
			return {
				"error": false,
				"id": user.UserID,
				"nick": user.Nick,
				"avatar": user.Avatar,
				"role": user.Role
			}
		}
		else {
			return {
				"error": true,
				"message": "Invalid JWT!"
			};
		}
	}

	getFullUser(jwt: string) {
		const valid = validJWT(jwt);
		if (valid) {
			let payload = jwt.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			let date = new Date(exp);
			if (date < new Date()) {
				return {
					"error": true,
					"message": "Expired token!"
				}
			}
			const select = this.db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					"error": true,
					"message": "User not found!"
				}
			}
			return {
				"error": false,
				"nick": user.Nick,
				"email": user.Email,
				"avatar": user.Avatar,
				"role": user.Role
			}
		}
		else {
			return {
				"error": true,
				"message": "Invalid JWT!"
			};
		}
	}

	// Registers a new user in the DB
	addUser(json: any): User {
		let user = new User(json);
		user.hashPassword();

		try {
			const insert = this.db.prepare('INSERT INTO Users (Nick, Email, Password, Role, Avatar, Online) VALUES (?, ?, ?, ?, ?, ?)');
			const statementSync = insert.run(json.nick, json.email, user.getPassword(), "USER", json.avatar, 1);
			user.setID(statementSync.lastInsertRowid as number);
			return user;
		}
		catch (e) {
			throw (e);
		}
	}

	// Registers a Google sign-up user in the DB
	addGoogleUser(json: any): any {
		try {
			const insert = this.db.prepare('INSERT INTO Users (Nick, Email, Role, Avatar, Online) VALUES (?, ?, ?, ?, ?)');
			const statementSync = insert.run(json.nick, json.email, "USER", json.avatar, 1);
			const id: number = statementSync.lastInsertRowid as number;
			return {
				id,

			};
		}
		catch (e) {
			throw (e);
		}
	}

	// Finds the user in the DB by email
	findUser(json: any): any {
		const select = this.db.prepare("SELECT * FROM Users WHERE Email = ?");
		const user = select.get(json.email);
		if (user) {
			return {
				error: false,
				id: user.UserID,
				nick: user.Nick,
				avatar: user.Avatar,
				password: user.Password,
				role: user.role
			}
		}
		return {
			error: true,
			message: "User not found"
		};
	}

	logoutUser(jwt: string) {
		let user = this.getUser(jwt);
		// change online to 0 in the DB
		console.log("Logging out", user.nick);
	}

	updateNick(json: any) {
		try {
			const select = this.db.prepare("UPDATE Users SET Nick = ? WHERE UserID = ?");
			const user = select.run(json.nick, json.id);
		}
		catch (e) {
			throw (e);
		}
	}

	updateAvatar(json: any) {
		try {
			const select = this.db.prepare("UPDATE Users SET Avatar = ? WHERE UserID = ?");
			const user = select.run(json.avatar, json.id);
		}
		catch (e) {
			throw (e);
		}
	}

}
