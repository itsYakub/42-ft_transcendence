import { Controller } from '../common/Controller.js'
import { User } from "./User.js";
import { createJWT } from "../common/jwt.js";
import { compareSync } from "bcrypt-ts";

export class UserController extends Controller {
	setup(): void {
		this.db.exec(`DROP TABLE IF EXISTS Users;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Nick TEXT UNIQUE NOT NULL,
      Email TEXT UNIQUE NOT NULL,
	  Avatar TEXT NOT NULL,
      Password TEXT NOT NULL,
	  Role TEXT NOT NULL
    );
  `);
		console.log("Set up user db");
	}

	addUser(json: any) {
		let user = new User(json);
		user.hashPassword();

		try {
			const insert = this.db.prepare('INSERT INTO Users (Nick, Email, Password, Role, Avatar) VALUES (?, ?, ?, ?, ?)');
			const statementSync = insert.run(user.getNick(), user.getEmail(), user.getPassword(), user.getRole(), user.getAvatar());
			user.setID(statementSync.lastInsertRowid as number);
			const jwt = createJWT(user.getID());
			return {
				"error": false,
				"nick": user.getNick(),
				"avatar": user.getAvatar(),
				"jwt": jwt
			};
		}
		catch (e) {
			if ("constraint failed" == e.errstr) {
				return {
					"error": true,
					"message": "Either the nickname or the email is already taken!"
				}
			}
			return {
				"error": true,
				"message": "SQL error!"
			};
		}
	}

	loginUser(json: any) {
		const select = this.db.prepare("SELECT * FROM Users WHERE Email = ?");
		const user = select.get(json.email);
		if (user && compareSync(json.password, user.Password as string)) {
			const jwt = createJWT(user.UserID as number);
			return {
				"error": false,
				"jwt": jwt,
				"nick": user.Nick as string,
				"avatar": user.Avatar as string
			}
		}
		return {
			"error": true,
			"message": "Unknown login!"
		};
	}
}
