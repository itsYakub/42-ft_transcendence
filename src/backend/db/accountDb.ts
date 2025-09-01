import { DatabaseSync } from "node:sqlite";
import { compareSync } from "bcrypt-ts";
import { hashPassword } from "./jwt.js";
import { Result, User } from "../../common/interfaces.js";

/*
	Replace a user's password with a new one
*/
export function updatePassword(db: DatabaseSync, checkPassword: string,  newPassword: string, user: User): Result {
	if (compareSync(checkPassword, user.password)) {
		const hashedPassword = hashPassword(newPassword);
		try {
			const select = db.prepare("UPDATE users SET password = ? WHERE user_id = ?");
			select.run(hashedPassword, user.userId);
			return Result.SUCCESS;
		}
		catch (e) {
			return Result.ERR_DB;;
		}
	}
	else
		return Result.ERR_FORBIDDEN;
}

/*
	Replaces the user's nickname with a new one - must be unique!
*/
export function updateNick(db: DatabaseSync, newNick: string, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET nick = ? WHERE user_id = ?");
		select.run(newNick, id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function replaceInvalidBase64Chars(input: string) {
	return input.replace(/[#_]/g, charToBeReplaced => {
		switch (charToBeReplaced) {
			case '#':
				return '+';
			case '_':
				return '/';
		}
	});
}

/*
	Replaces a user's avatar with a new one
*/
export function updateAvatar(db: DatabaseSync, avatar: string, type: string, id: number): Result {
	try {
		avatar = `data:image/${type};base64,${avatar}`;
		avatar = replaceInvalidBase64Chars(avatar);
		const select = db.prepare("UPDATE users SET avatar = ? WHERE user_id = ?");
		select.run(avatar, id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Adds a new TOTP secret to the DB. At this point it's unverified
*/
export function addTotpSecret(db: DatabaseSync, secret: string, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_secret = ? WHERE user_id = ?");
		select.run(secret, id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Marks the previously-added secret as verified
*/
export function confirmAppTotp(db: DatabaseSync, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_type = 'APP' WHERE user_id = ?");
		select.run(id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Marks the previously-added secret as verified
*/
export function confirmEmailTotp(db: DatabaseSync, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_type = 'EMAIL' WHERE user_id = ?");
		select.run(id);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Removes the TOTP secret and sets the verified column to 0
*/
export function disableTotp(db: DatabaseSync, id: number): Result {
	try {
		const select = db.prepare("UPDATE users SET totp_secret = NULL, totp_type = 'DISABLED' WHERE user_id = ?");
		select.run(id);
		return Result.SUCCESS;;
	}
	catch (e) {
		return Result.ERR_DB;;
	}
}
