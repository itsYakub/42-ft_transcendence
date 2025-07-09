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
			const sub = JSON.parse(payload).sub;
			
			const select = this.db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			return {
				"nick": user.Nick,
				"profilePic": "buffed_red_engineer.jpg",//user.ProfilePic,
				"role": user.Role
			}
		}
		else {
			return {};
		}
	}
}
