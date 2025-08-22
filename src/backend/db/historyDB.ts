import { DatabaseSync } from "node:sqlite";
import { Result } from "../../common/interfaces.js";

export function initHistoryDb(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS history (
		history_id INTEGER PRIMARY KEY AUTOINCREMENT,
		user_id INTEGER NOT NULL,
		p2_name TEXT NOT NULL,
		score INTEGER NOT NULL,
		p2_score INTEGER NOT NULL,
		tournament_win INTEGER NOT NULL,
		played_at TEXT NOT NULL
		);`);
}

/*
	Gets all the user's matches
*/
export function getHistory(db: DatabaseSync, id: number): any {
	try {
		const select = db.prepare("SELECT * FROM history WHERE user_id = ? ORDER BY played_at DESC");
		const matches = select.all(id);
		return {
			result: Result.SUCCESS,
			matches
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function addHistory(db: DatabaseSync, { id, p2Name, score, p2Score, tournamentWin }, date: Date = new Date()): any {
	try {
		const select = db.prepare("INSERT INTO history (user_id, p2_name, score, p2_score, tournament_win, played_at) VALUES (?, ?, ?, ?, ?, ?)");
		select.run(id, p2Name, score, p2Score, tournamentWin ? 1 : 0, date.toISOString());
		return {
			result: Result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}
