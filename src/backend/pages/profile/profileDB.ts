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
				message: "SUCCESS"
			};
		}
		catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
		}
	}
	else
		return {
			code: 403,
			error: "ERR_BAD_PASSWORD"
		};
}

export function updateNick(db: DatabaseSync, user: any): any {
	try {
		const select = db.prepare("UPDATE Users SET Nick = ? WHERE UserID = ?");
		select.run(user.nick, user.id);
		return {
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function updateAvatar(db: DatabaseSync, json: any): any {
	try {
		const select = db.prepare("UPDATE Users SET Avatar = ? WHERE UserID = ?");
		select.run(json.avatar, json.id);
		return {
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function addTOTPSecret(db: DatabaseSync, json: any) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPSecret = ? WHERE UserID = ?");
		select.run(json.secret, json.id);
		return {
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function confirmTOTP(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPVerified = 1 WHERE UserID = ?");
		select.run(id);
		return {
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function removeTOTPSecret(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPSecret = NULL, TOTPVerified = 0 WHERE UserID = ?");
		select.run(id);
		return {
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}
