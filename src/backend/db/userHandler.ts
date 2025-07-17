import { createJWT } from "./jwt.js";
import { DB } from "./db.js";
import { compareSync } from "bcrypt-ts";

export function addUserToDB(db: DB, json: any): any {
	try {
		let user = db.addUser(json);
		const jwt = createJWT(user.getID());
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
			}
		}
		return {
			"error": true,
			"message": "SQL error!"
		};
	}
}

export function addGoogleUserToDB(db: DB, json: any): any {
	try {
		const existingUser = db.findUser(json);
		if (!existingUser.error) {
			const jwt = createJWT(existingUser.id);
			return {
				"error": false,
				"jwt": jwt
			};
		}
		let user = db.addGoogleUser(json);
		const jwt = createJWT(user.id);
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
			}
		}
		return {
			"error": true,
			"message": "SQL error!"
		};
	}
}

export function loginUser(db: DB, json: any): any {
	try {
		let user = db.findUser(json);
		if (user.error) {
			return user;
		}
		if (compareSync(json.password, user.password)) {
			const jwt = createJWT(user.id);
			return {
				"error": false,
				"jwt": jwt,
				"nick": user.nick,
				"avatar": user.avatar
			}
		}
		return {
			"error": true,
			"message": "Unknown login!"
		};
	}
	catch (e) {
		return {
			"error": true,
			"message": "Internal error!"
		};
	}
}
