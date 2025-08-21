import { DatabaseSync } from "node:sqlite";
import { result } from "../../common/interfaces.js";

export function initFoes(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS foes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		foe_id INTEGER NOT NULL
		);`);
}

/*
	Gets all the user's blocked ids
*/
export function getFoes(db: DatabaseSync, { userId }) {
	try {
		const select = db.prepare("SELECT foe_id, nick FROM foes INNER JOIN users ON users.user_id = foes.foe_id WHERE fOES.user_id = ? ORDER BY online DESC, nick");
		const foes = select.all(userId);
		return {
			result: result.SUCCESS,
			foes
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB
		};
	}
}

/*
	Adds somebody to the block list
*/
export function addFoe(db: DatabaseSync, { userId, foeId }): any {
	try {
		const select = db.prepare("INSERT INTO foes (user_id, foe_id) VALUES (?, ?)");
		select.run(userId, foeId);
		return {
			result: result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB
		};
	}
}

/*
	Unblocks someone from a user's list
*/
export function removeFoe(db: DatabaseSync, { userId, foeId }): any {
	try {
		const select = db.prepare("DELETE FROM foes WHERE user_id = ? AND foe_id = ?");
		select.run(userId, foeId);
		return {
			result: result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB
		};
	}
}
