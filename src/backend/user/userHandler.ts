import { accessToken, refreshToken } from "./jwt.js";
import { DB } from "../db/db.js";
import { compareSync } from "bcrypt-ts";

/*
	Adds a user to the DB after a sign up with email/password
*/
export function addUserToDB(db: DB, json: any): any {
	try {
		const user = db.addUser(json);
		const token = refreshToken(user.id);
		db.updateRefreshtoken(user.id, token);
		return {
			"accessToken": accessToken(user.id),
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
		const existingUser = db.getUserByEmail(json.email);
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
		const user = db.getUserByEmail(json.email);
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
			"error": "Unknown login or wrong password!"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "Internal error!"
		};
	}
}

export function updatePassword(db: DB, user: any, passwords: any): any {
	if (compareSync(passwords.currentPassword, user.password)) {
		try {
			db.updatePassword(user.id, passwords.newPassword);
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
	else
		return {
			"code": 200,
			"error": "Bad password"
		};
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
