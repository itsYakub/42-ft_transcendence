import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Foe, Result } from "../../common/interfaces.js";

/*
	Gets all the user's blocked ids
*/
export function readFoes(db: DatabaseSync, userId: number): Box<Foe[]> {
	try {
		//const select = db.prepare("SELECT foes.user_id, foe_id, nick FROM foes INNER JOIN users ON users.user_id = foes.foe_id WHERE foes.user_id = ? ORDER BY online DESC, nick");
		const select = db.prepare("SELECT *, nick FROM foes INNER JOIN users ON users.user_id = foes.foe_id WHERE foes.user_id = ? ORDER BY nick");
		const foes = select.all(userId).map(foe => sqlToFoe(foe));
		return {
			result: Result.SUCCESS,
			contents: foes
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Adds somebody to the foe list
*/
export function createFoe(db: DatabaseSync, userId: number, foeId: number): Result {
	try {
		const select = db.prepare("INSERT INTO foes (user_id, foe_id) VALUES (?, ?)");
		select.run(userId, foeId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Unblocks someone from a user's list
*/
export function deleteFoe(db: DatabaseSync, userId: number, foeId: number): Result {
	try {
		const select = db.prepare("DELETE FROM foes WHERE user_id = ? AND foe_id = ?");
		select.run(userId, foeId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToFoe(foe: Record<string, SQLOutputValue>): Foe {
	return {
		foeId: foe.foe_id as number,
		nick: foe.nick as string,
		userId: foe.user_id as number
	};
}
