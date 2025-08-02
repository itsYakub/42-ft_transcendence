import { DatabaseSync } from "node:sqlite";

export function initMatches(db: DatabaseSync, dropMatches: boolean): void {
	if (dropMatches)
		db.exec(`DROP TABLE IF EXISTS Matches;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Matches (
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
export function getMatches(db: DatabaseSync, id: number): any {
	try {
		const select = db.prepare("SELECT * FROM Matches WHERE UserID = ? ORDER BY PlayedAt DESC");
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

export function addMatch(db: DatabaseSync, json: any, date: Date = new Date()): any {
	try {
		const select = db.prepare("INSERT INTO Matches (UserID, P2Name, Score, P2Score, TournamentWin, PlayedAt) VALUES (?, ?, ?, ?, ?, ?)");
		select.run(json.id, json.p2Name, json.score, json.p2Score, json.tournamentWin ? 1 : 0, date.toISOString());
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
