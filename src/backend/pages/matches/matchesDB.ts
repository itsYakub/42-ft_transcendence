import { DatabaseSync } from "node:sqlite";

export function initMatches(db: DatabaseSync, dropMatches: boolean): void {
	if (dropMatches)
		db.exec(`DROP TABLE IF EXISTS Matches;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Matches (
		MatchID INTEGER PRIMARY KEY AUTOINCREMENT,
		UserID INTEGER NOT NULL,
		Message TEXT NOT NULL,
		Rating INTEGER NOT NULL,
		PlayedAt DATE
		);`);
}

/*
	Gets all the user's matches
*/
export function getMatches(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("SELECT * FROM Matches WHERE UserID = ? ORDER BY PlayedAt DESC");
		const matches = select.all(id);
		return matches;
	}
	catch (e) {
		console.log(e);
		throw (e);
	}
}

export function addMatch(db: DatabaseSync, json: any, date: Date = new Date()): any {
	try {
		const select = db.prepare("INSERT INTO Matches (UserID, Message, Rating, PlayedAt) VALUES (?, ?, ?, ?)");
		select.run(json.id, json.message, json.rating, date.toLocaleDateString("pl-PL"));
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
