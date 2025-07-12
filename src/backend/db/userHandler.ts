import { createJWT } from "./jwt.js";
import { DB } from "./db.js";
import { compareSync } from "bcrypt-ts";

export function addUserToDB(db: DB, json: any) {
	try {
		let user = db.addUser(json);
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

export function loginUser(db: DB, json: any) {
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
