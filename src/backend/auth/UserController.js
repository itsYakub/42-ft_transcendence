import { Controller } from '../common/Controller.js';
import { User } from "./User.js";
import { createJWT } from "../common/jwt.js";
export class UserController extends Controller {
    setup() {
        this.db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Nick TEXT UNIQUE NOT NULL,
      Email TEXT UNIQUE NOT NULL,
	  ProfilePic TEXT,
      Password TEXT NOT NULL,
	  Role TEXT NOT NULL
    );
  `);
        console.log("Set up user db");
    }
    addUser(json) {
        let user = new User(json);
        user.hashPassword();
        try {
            const insert = this.db.prepare('INSERT INTO Users (Nick, Email, Password, Role) VALUES (?, ?, ?, ?)');
            const statementSync = insert.run(user.getNick(), user.getEmail(), user.getPassword(), user.getRole());
            user.setID(statementSync.lastInsertRowid);
            const jwt = createJWT(user);
            return {
                "error": false,
                "jwt": jwt
            };
        }
        catch (e) {
            if ("constraint failed" == e.errstr) {
                return {
                    "error": true,
                    "message": "Either the nickname or the email is already taken!"
                };
            }
            return {
                "error": true,
                "message": "SQL error!"
            };
        }
    }
}
