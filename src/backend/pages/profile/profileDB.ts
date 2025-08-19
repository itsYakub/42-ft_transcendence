import { DatabaseSync } from "node:sqlite";
import { compareSync } from "bcrypt-ts";
import { hashPassword } from "../../user/jwt.js";

/*
	Replace a user's password with a new one
*/
export function updatePassword(db: DatabaseSync, { id, checkPassword, currentPassword, newPassword }): any {
	if (compareSync(checkPassword, currentPassword)) {
		const hashedPassword = hashPassword(newPassword);
		try {
			const select = db.prepare("UPDATE Users SET Password = ? WHERE UserID = ?");
			select.run(hashedPassword, id);
			return {
				code: 200,
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

/*
	Replaces the user's nickname with a new one - must be unique!
*/
export function updateNick(db: DatabaseSync, { id, newNick }): any {
	try {
		const select = db.prepare("UPDATE Users SET Nick = ? WHERE UserID = ?");
		select.run(newNick, id);
		return {
			code: 200,
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
export function updateAvatar(db: DatabaseSync, { avatar, id, type }): any {
	try {
		avatar = `data:image/${type};base64,${avatar}`;
		avatar = replaceInvalidBase64Chars(avatar);
		const select = db.prepare("UPDATE Users SET Avatar = ? WHERE UserID = ?");
		select.run(avatar, id);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {console.log(e);
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Adds a new TOTP secret to the DB. At this point it's unverified
*/
export function addTOTPSecret(db: DatabaseSync, json: any) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPSecret = ? WHERE UserID = ?");
		select.run(json.secret, json.id);
		return {
			code: 200,
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

/*
	Marks the previously-added secret as verified
*/
export function confirmTOTP(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPVerified = 1 WHERE UserID = ?");
		select.run(id);
		return {
			code: 200,
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

/*
	Removes the TOTP secret and sets the verified column to 0
*/
export function removeTOTPSecret(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET TOTPSecret = NULL, TOTPVerified = 0 WHERE UserID = ?");
		select.run(id);
		return {
			code: 200,
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
