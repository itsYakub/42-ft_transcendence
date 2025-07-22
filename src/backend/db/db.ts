import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs";
import { hashPassword, validJWT } from "../user/jwt.js";

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
      Nick TEXT NOT NULL,
      Email TEXT UNIQUE NOT NULL,
	  Avatar TEXT NOT NULL,
      Password TEXT,
	  Role TEXT NOT NULL,
	  RefreshToken TEXT UNIQUE,
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

	/*
		Returns db_error or the specified decoded view
	*/
	getView(viewName: string): string {
		try {
			const select = this.db.prepare("SELECT * FROM Views WHERE ViewName = ?");
			const view = select.get(viewName);
			return atob(view.Content as string);
		}
		catch (e) {
			return "db_error";
		}
	}

	getFrameView(viewName: string): any {
		const frame = this.getFrame();
		const content = this.getView(viewName);
		return {
			frame,
			content
		};
	}

	/*
		Gets a user using the refresh token if it's still valid
	*/
	getUserByRefreshToken(refreshToken: string, fulluser: boolean = false): any {
		const valid = validJWT(refreshToken);
		if (valid) {
			let payload = refreshToken.split(".")[1];
			payload = atob(payload);
			const { exp } = JSON.parse(payload);
			const date = new Date(exp);
			if (date < new Date()) {
				return {
					"error": "Expired token!"
				}
			}
			const select = this.db.prepare("SELECT * FROM Users WHERE RefreshToken = ?");
			const user = select.get(refreshToken);
			if (!user) {
				return {
					"error": "User not found!"
				}
			}
			if (fulluser)
				return {
					"id": user.UserID,
					"nick": user.Nick,
					"email": user.Email,
					"avatar": user.Avatar,
					"password": user.Password,
					"role": user.Role,
					"refreshToken": user.RefreshToken,
					"online": user.Online,
					"google": user.Password == null
				};
			else
				return {
					"id": user.UserID,
					"nick": user.Nick,
					"avatar": user.Avatar,
					"role": user.Role,
					"google": user.Password == null
				};
		}
		return {
			"error": "User not found!"
		}
	}

	/*
		Returns an error message or user data
	*/
	getUser(accessToken: string, refreshToken: string, fulluser: boolean = false): any {
		const valid = validJWT(accessToken);
		if (valid) {
			let payload = accessToken.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			const date = new Date(exp);
			if (date < new Date()) {
				return this.getUserByRefreshToken(refreshToken, fulluser);
			}

			const select = this.db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					"code": 401,
					"error": "User not found!"
				}
			}
			if (fulluser)
				return {
					"id": user.UserID,
					"nick": user.Nick,
					"email": user.Email,
					"avatar": user.Avatar,
					"password": user.Password,
					"role": user.Role,
					"refreshToken": user.RefreshToken,
					"online": user.Online,
					"google": user.Password == null
				};
			else
				return {
					"id": user.UserID,
					"nick": user.Nick,
					"avatar": user.Avatar,
					"role": user.Role,
					"google": user.Password == null
				};
		}
		else
			return this.getUserByRefreshToken(refreshToken, fulluser);
	}

	// Registers a new user in the DB
	addUser(json: any): any {
		const password = hashPassword(json.password);
		try {
			const insert = this.db.prepare('INSERT INTO Users (Nick, Email, Password, Role, Avatar, Online) VALUES (?, ?, ?, ?, ?, ?)');
			const statementSync = insert.run(json.nick, json.email, password, "USER", json.avatar, 1);
			return {
				"id": statementSync.lastInsertRowid as number
			};
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
	getUserByEmail(email: string): any {
		const select = this.db.prepare("SELECT * FROM Users WHERE Email = ?");
		const user = select.get(email);
		if (user) {
			return {
				id: user.UserID,
				nick: user.Nick,
				avatar: user.Avatar,
				password: user.Password,
				role: user.role
			}
		}
		return {
			error: "User not found"
		};
	}

	logoutUser(accessToken: string, refreshToken: string) {
		const user = this.getUser(accessToken, refreshToken);
		// change online to 0 in the DB
		console.log("Logging out", user.nick);
	}

	updateRefreshtoken(id: number, refreshToken: string) {
		try {
			const select = this.db.prepare("UPDATE Users SET RefreshToken = ? WHERE UserID = ?");
			select.run(refreshToken, id);
		}
		catch (e) {
			throw (e);
		}
	}

	invalidateToken(json: any) {
		try {
			const select = this.db.prepare("UPDATE Users SET RefreshToken = NULL WHERE UserID = ?");
			select.run(json.id);
		}
		catch (e) {
			throw (e);
		}
	}

	updatePassword(id: number, password: string) {
		const hashedPassword = hashPassword(password);
		try {
			const select = this.db.prepare("UPDATE Users SET Password = ? WHERE UserID = ?");
			select.run(hashedPassword, id);
		}
		catch (e) {
			throw (e);
		}
	}

	updateNick(id: number, nick: string) {
		try {
			const select = this.db.prepare("UPDATE Users SET Nick = ? WHERE UserID = ?");
			select.run(nick, id);
		}
		catch (e) {
			throw (e);
		}
	}

	updateAvatar(id: number, avatar: string) {
		try {
			const select = this.db.prepare("UPDATE Users SET Avatar = ? WHERE UserID = ?");
			select.run(avatar, id);
		}
		catch (e) {
			throw (e);
		}
	}

}
