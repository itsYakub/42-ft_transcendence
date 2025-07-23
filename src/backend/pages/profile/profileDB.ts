import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "../../user/jwt.js";
import { compareSync } from "bcrypt-ts";

export function updatePassword(db: DatabaseSync, user: any, passwords: any): any {
	if (compareSync(passwords.currentPassword, user.password)) {
		const hashedPassword = hashPassword(passwords.newPassword);
		try {
			const select = db.prepare("UPDATE Users SET Password = ? WHERE UserID = ?");
			select.run(hashedPassword, user.id);
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

export function updateNick(db: DatabaseSync, user: any, passwords: any): any {
	// change in friends table
	try {
		const select = db.prepare("UPDATE Users SET Nick = ? WHERE UserID = ?");
		select.run(user.nick, user.id);
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

export function updateAvatar(db: DatabaseSync, id: number, avatar: string): any {
	try {
		const select = db.prepare("UPDATE Users SET Avatar = ? WHERE UserID = ?");
		select.run(avatar, id);
		return {
			"message": "Updated avatar!"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}
