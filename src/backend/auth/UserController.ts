import { DatabaseSync } from 'node:sqlite';
import { User } from "./UserModel.js";
import { createJWT } from "./jwt.js"

export class UserController {
	constructor(private db: DatabaseSync) {
		this.setup();
	}

	setup(): void {
		this.db.exec(`DROP TABLE IF EXISTS Users;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Nick TEXT UNIQUE NOT NULL,
      Email TEXT UNIQUE NOT NULL,
      Password TEXT NOT NULL,
	  Role TEXT NOT NULL
    );
  `);
		console.log("Set up user db");
	}

	addUser(json): boolean {
		let user = new User(json);
		user.hashPassword();

		try {
			const insert = this.db.prepare('INSERT INTO Users (Nick, Email, Password, Role) VALUES (?, ?, ?, ?)');
			const ttt = insert.run(user.getNick(), user.getEmail(), user.getPassword(), user.getRole());	
			user.setID(ttt.lastInsertRowid as number);	
			const jwt = createJWT(user);
			console.log(jwt);
			return true;
		}
		catch (e) {
			if ("constraint failed" == e.errstr) {

			}
			return false;
		}
	}
}
