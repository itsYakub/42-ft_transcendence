import { DatabaseSync } from 'node:sqlite';
import { validJWT } from './jwt.js';

export abstract class Controller {
	constructor(protected db: DatabaseSync) {
		this.setup();
	}

	abstract setup(): void;

	getUser(jwt: string) {
		const valid = validJWT(jwt);
		if (valid) {
			let payload = jwt.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			let date = new Date(exp);
			if (date < new Date()) {
				return {
					"error": true,
					"message": "Expired token!"
				}
			}
			const select = this.db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					"error": true,
					"message": "User not found!"
				}
			}
			return {
				"error": false,
				"nick": user.Nick,
				"avatar": user.Avatar,
				"role": user.Role
			}
		}
		else {
			return {
				"error": true,
				"message": "Invalid JWT!"
			};
		}
	}

	getFullUser(jwt: string) {
		const valid = validJWT(jwt);
		if (valid) {
			let payload = jwt.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			let date = new Date(exp);
			if (date < new Date()) {
				return {
					"error": true,
					"message": "Expired token!"
				}
			}
			const select = this.db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					"error": true,
					"message": "User not found!"
				}
			}
			return {
				"error": false,
				"nick": user.Nick,
				"email": user.Email,
				"avatar": user.Avatar,
				"role": user.Role
			}
		}
		else {
			return {
				"error": true,
				"message": "Invalid JWT!"
			};
		}
	}
}
