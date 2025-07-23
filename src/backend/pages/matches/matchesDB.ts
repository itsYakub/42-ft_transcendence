import { DatabaseSync } from "node:sqlite";

export function initMatches(db: DatabaseSync, dropMatches: boolean): void {
	if (dropMatches)
		db.exec(`DROP TABLE IF EXISTS Matches;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Matches (
		MatchID INTEGER PRIMARY KEY AUTOINCREMENT,
		P1ID INTEGER NOT NULL,
		P2Name TEXT NOT NULL,
		P1Score INTEGER NOT NULL,
		P2Score INTEGER NOT NULL,
		PlayedAt DATE
		);`);
}

export function addMatch(db: DatabaseSync, json: any, date: Date = new Date()): any {
	try {
		const select = db.prepare("INSERT INTO Matches (P1ID, P2Name, P1Score, P2Score, PlayedAt) VALUES (?, ?, ?, ?, ?)");
		select.run(json.p1ID, json.p2Name, json.p1Score, json.p2Score, date.toLocaleDateString("pl-PL"));
		return {
			"message": "Added match!"
		};
	}
	catch (e) {
		return {
			"code": 500,
			"error": "SQL error!"
		};
	}
}
