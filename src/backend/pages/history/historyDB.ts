import { DatabaseSync } from "node:sqlite";

export function initHistory(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS History (
		MatchID INTEGER PRIMARY KEY AUTOINCREMENT,
		UserID INTEGER NOT NULL,
		P2Name TEXT NOT NULL,
		Score INTEGER NOT NULL,
		P2Score INTEGER NOT NULL,
		TournamentWin INTEGER NOT NULL,
		PlayedAt TEXT NOT NULL
		);`);
}

/*
	Gets all the user's matches
*/
export function getHistory(db: DatabaseSync, id: number): any {
	try {
		const select = db.prepare("SELECT * FROM History WHERE UserID = ? ORDER BY PlayedAt DESC");
		const matches = select.all(id);
		return {
			code: 200,
			matches
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function addHistory(db: DatabaseSync, { id, p2Name, score, p2Score, tournamentWin}, date: Date = new Date()): any {
	try {
		const select = db.prepare("INSERT INTO History (UserID, P2Name, Score, P2Score, TournamentWin, PlayedAt) VALUES (?, ?, ?, ?, ?, ?)");
		select.run(id, p2Name, score, p2Score, tournamentWin ? 1 : 0, date.toISOString());
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
