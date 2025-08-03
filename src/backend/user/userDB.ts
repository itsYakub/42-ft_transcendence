import { DatabaseSync } from "node:sqlite";
import { accessToken, hashPassword, refreshToken, validJWT } from "../user/jwt.js";
import { compareSync } from "bcrypt-ts";

/*
	Sets up the Users table
*/
export function initUsers(db: DatabaseSync, dropUsers: boolean): void {
	if (dropUsers)
		db.exec(`DROP TABLE IF EXISTS Users;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Users (
		UserID INTEGER PRIMARY KEY AUTOINCREMENT,
		Nick TEXT NOT NULL,
		Email TEXT UNIQUE NOT NULL,
		TOTPVerified INTEGER NOT NULL DEFAULT 0,
		Online INTEGER NOT NULL,
		Avatar TEXT NOT NULL,
		Password TEXT,
		RefreshToken TEXT UNIQUE,
		TOTPSecret TEXT
		);`);
}

/*
	Gets a user using the refresh token if it's still valid
*/
function getUserByRefreshToken(db: DatabaseSync, refreshToken: string): any {
	const valid = validJWT(refreshToken);
	if (valid) {
		let payload = refreshToken.split(".")[1];
		payload = atob(payload);
		const { exp } = JSON.parse(payload);
		const date = new Date(exp);
		if (date < new Date()) {
			return {
				code: 404,
				error: "ERR_EXPIRED_TOKEN"
			}
		}
		const select = db.prepare("SELECT * FROM Users WHERE RefreshToken = ?");
		const user = select.get(refreshToken);
		if (!user) {
			return {
				code: 404,
				error: "ERR_NO_USER"
			}
		}
		return {
			id: user.UserID,
			nick: user.Nick,
			email: user.Email,
			avatar: user.Avatar,
			password: user.Password,
			refreshToken: user.RefreshToken,
			online: user.Online,
			totpSecret: user.TOTPSecret,
			totpVerified: user.TOTPVerified,
			totpEmail: user.TOTPEmail,
			google: user.Password == null
		};
	}
	return {
		code: 404,
		error: "ERR_NO_USER"
	}
}

/*
	Returns a complete user from the DB
*/
export function getUser(db: DatabaseSync, accessToken: string, refreshToken: string): any {
	try {
		const valid = validJWT(accessToken);
		if (valid) {
			let payload = accessToken.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			const date = new Date(exp);
			if (date < new Date()) {
				return getUserByRefreshToken(db, refreshToken);
			}

			const select = db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					code: 404,
					error: "ERR_NO_USER"
				}
			}
			return {
				id: user.UserID,
				nick: user.Nick,
				email: user.Email,
				avatar: user.Avatar,
				password: user.Password,
				refreshToken: user.RefreshToken,
				online: user.Online,
				totpSecret: user.TOTPSecret,
				totpVerified: user.TOTPVerified,
				totpEmail: user.TOTPEmail,
				google: user.Password == null
			};
		}
		else
			return getUserByRefreshToken(db, refreshToken);
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		}
	}
}

/*
	Adds a user to the DB after a sign up with email/password
*/
export function addUser(db: DatabaseSync, { nick, email, password, avatar, online }): any {
	try {
		const pw = hashPassword(password);
		const insert = db.prepare('INSERT INTO Users (Nick, Email, Password, Avatar, Online) VALUES (?, ?, ?, ?, ?)');
		const statementSync = insert.run(nick, email, pw, avatar, online);
		const id: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(id);
		updateRefreshtoken(db, {
			id, refreshToken: token
		});
		return {
			accessToken: accessToken(id),
			refreshToken: token
		};
	}
	catch (e) {
		if ("constraint failed" == e.errstr) {
			return {
				code: 401,
				error: "ERR_EMAIL_IN_USE"
			}
		}
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	After a successful Google Sign-in/up, gets the user from the DB or adds it
*/
export function addGoogleUser(db: DatabaseSync, { nick, email, avatar, online }): any {
	try {
		const existingUser = getUserByEmail(db, email);
		if (!existingUser.error) {
			const token = refreshToken(existingUser.id);
			updateRefreshtoken(db, {
				id: existingUser.id,
				refreshToken: token
			});
			return {
				accessToken: accessToken(existingUser.id),
				refreshToken: token
			};
		}
		
		const insert = db.prepare('INSERT INTO Users (Nick, Email, Avatar, Online) VALUES (?, ?, ?, ?)');
		const statementSync = insert.run(nick, email, avatar, online);
		const id: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(id);
		updateRefreshtoken(db, {
			id, refreshToken: token
		});
		return {
			accessToken: accessToken(id),
			refreshToken: token
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
	Gets a user from the DB after an email/password login
*/
export function loginUser(db: DatabaseSync, { email, password }) {
	try {
		const user = getUserByEmail(db, email);
		if (user.error) {
			return user;
		}

		// if (1 == user.totpEnabled) {
		// 	return user;
		// }

		if (compareSync(password, user.password)) {
			const token = refreshToken(user.id);
			updateRefreshtoken(db, {
				id: user.id, refreshToken: token
			});
			return {
				nick: user.nick,
				email: user.email,
				avatar: user.avatar,
				accessToken: accessToken(user.id),
				refreshToken: token,
				totpEnabled: user.totpEnabled,
				totpSecret: user.totpSecret
			}
		}
		return {
			code: 401,
			error: "ERR_NO_USER"
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
	Gets a user from the DB after an email/password login
*/
export function loginUserWithTOTP(db: DatabaseSync, { email, password, code }) {
	try {
		const user = getUserByEmail(db, email);
		if (user.error) {
			return user;
		}

		// let totp = new OTPAuth.TOTP({
		// 			issuer: "Transcendence",
		// 			label: user.email,
		// 			algorithm: "SHA256",
		// 			digits: 6,
		// 			period: 30,
		// 			secret: user.totpSecret,
		// 		});

		// 		const params = JSON.parse(request.body as string);
		// 		if (null == totp.validate({ token: params.code, window: 1 })) {

		if (compareSync(password, user.password)) {
			const token = refreshToken(user.id);
			updateRefreshtoken(db, {
				id: user.id, refreshToken: token
			});
			return {
				nick: user.nick,
				avatar: user.avatar,
				accessToken: accessToken(user.id),
				refreshToken: token
			}
		}
		return {
			code: 401,
			error: "ERR_NO_USER"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

// Finds the user in the DB by email
export function getUserByEmail(db: DatabaseSync, email: string): any {
	try {
		const select = db.prepare("SELECT * FROM Users WHERE Email = ?");
		const user = select.get(email);
		if (user) {
			return {
				id: user.UserID,
				nick: user.Nick,
				email: user.Email,
				avatar: user.Avatar,
				password: user.Password,
				totpEnabled: user.TOTPVerified,
				totpSecret: user.TOTPSecret
			}
		}
		return {
			code: 404,
			error: "ERR_NO_USER"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function updateRefreshtoken(db: DatabaseSync, { id, refreshToken }) {
	try {
		const select = db.prepare("UPDATE Users SET RefreshToken = ? WHERE UserID = ?");
		select.run(refreshToken, id);
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

export function invalidateToken(db: DatabaseSync, { id }) {
	try {
		const select = db.prepare("UPDATE Users SET RefreshToken = NULL WHERE UserID = ?");
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

export function markUserOnline(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET Online = 1 WHERE UserID = ?");
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

export function markUserOffline(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET Online = 0 WHERE UserID = ?");
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
