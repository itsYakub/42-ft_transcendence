import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs";
import { validJWT } from "./jwt.js";

export class DB {
	private db: DatabaseSync;

	constructor(dropTables: boolean) {
		this.db = new DatabaseSync(process.env.DB);
		this.initDB(dropTables);
	}

	initDB(dropTables: boolean): void {
		this.initUsers(dropTables);
		this.initMatches(dropTables);
		this.initViews(dropTables);
		if (dropTables)
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
      Password TEXT NOT NULL,
	  Role TEXT NOT NULL
    );`);
		console.log("Set up user db");
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
		console.log("Set up matches db");
	}

	initViews(dropTables: boolean): void {
		if (dropTables)
			this.db.exec(`DROP TABLE IF EXISTS Views;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Views (
      ViewName TEXT PRIMARY KEY,
	  Content BLOB
    );`);
		console.log("Set up views db");
	}

	fillViews(): void {
		const __dirname = import.meta.dirname;

		const views = ["frame", "home", "sidebar"];

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

	getSidebar(): string {
		return this.getView("sidebar");
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
}
