import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "../../user/jwt.js";
import { compareSync } from "bcrypt-ts";

export function updatePassword(db: DatabaseSync, json: any): any {
	if (compareSync(json.currentPassword, json.password)) {
		const hashedPassword = hashPassword(json.newPassword);
		try {
			const select = db.prepare("UPDATE Users SET Password = ? WHERE UserID = ?");
			select.run(hashedPassword, json.id);
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

export function updateNick(db: DatabaseSync, user: any): any {
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

export function updateAvatar(db: DatabaseSync, json: any): any {
	try {
		const select = db.prepare("UPDATE Users SET Avatar = ? WHERE UserID = ?");
		select.run(json.avatar, json.id);
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

export function addTOTPSecret(db: DatabaseSync, json: any) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPSecret = ? WHERE UserID = ?");
		select.run(json.secret, json.id);
		return {
			"message": "Added TOTP!"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}

export function confirmTOTP(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPVerified = 1 WHERE UserID = ?");
		select.run(id);
		return {
			"message": "Verified TOTP!"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}

export function removeTOTPSecret(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPSecret = NULL, TOTPVerified = 0 WHERE UserID = ?");
		select.run(id);
		return {
			"message": "Removed TOTP!"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}
