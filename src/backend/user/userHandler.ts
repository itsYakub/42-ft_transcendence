import { accessToken, refreshToken } from "./jwt.js";
import { DB } from "../db/db.js";
import { compareSync } from "bcrypt-ts";

/*
	Adds a user to the DB after a sign up with email/password
*/
export function addUserToDB(db: DB, json: any): any {
	try {
		const user = db.addUser(json);
		const token = refreshToken(user.getID());
		db.updateRefreshtoken(user.getID(), token);
		return {
			"accessToken": accessToken(user.getID()),
			"refreshToken": token
		};
	}
	catch (e) {
		if ("constraint failed" == e.errstr) {
			return {
				"code": 200,
				"error": "The email is already taken!"
			}
		}
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}

/*
	After a successful Google Sign-in/up, gets the user from the DB or adds it
*/
export function addGoogleUserToDB(db: DB, json: any): any {
	try {
		const existingUser = db.findUser(json);
		if (!existingUser.error) {
			const token = refreshToken(existingUser.id);
			db.updateRefreshtoken(existingUser.id, token);
			return {
				"accessToken": accessToken(existingUser.id),
				"refreshToken": token
			};
		}
		const user = db.addGoogleUser(json);
		const token = refreshToken(user.id);
		db.updateRefreshtoken(user.id, token);
		return {
			"accessToken": accessToken(user.id),
			"refreshToken": token
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}

/*
	Gets a user from the DB after an email/password login
*/
export function loginUser(db: DB, json: any): any {
	try {
		const user = db.findUser(json);
		if (user.error) {
			return user;
		}
		if (compareSync(json.password, user.password)) {
			const token = refreshToken(user.id);
			db.updateRefreshtoken(user.id, token);
			return {
				"nick": user.nick,
				"avatar": user.avatar,
				"accessToken": accessToken(user.id),
				"refreshToken": token
			}
		}
		return {
			"code": 200,
			"error": "Unknown login!"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "Internal error!"
		};
	}
}

export function updatePassword(db: DB, id: number, password: string): any {
	try {
		db.updatePassword(id, password);
		return {
			"message": "Updated password"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}

export function updateNick(db: DB, id: number, nick: string): any {
	try {
		db.updateNick(id, nick);
		return {
			"message": "Updated nickname"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}

export function updateAvatar(db: DB, id: number, avatar: string): any {
	try {
		db.updateAvatar(id, avatar);
		return {
			"message": "Updated avatar"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}
