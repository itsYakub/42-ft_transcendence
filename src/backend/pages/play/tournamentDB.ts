import { DatabaseSync } from "node:sqlite";
import { addMatch } from "../matches/matchDB.js";

export function initTournaments(db: DatabaseSync, dropTournaments: boolean): void {
	if (dropTournaments)
		db.exec(`DROP TABLE IF EXISTS Tournaments;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Tournaments (
		TournamentID INTEGER PRIMARY KEY AUTOINCREMENT,
		Code TEXT UNIQUE NOT NULL,
		Match INTEGER NOT NULL DEFAULT 0,
		M1P1 TEXT NOT NULL,
		M1P2 TEXT NOT NULL,
		M2P1 TEXT NOT NULL,
		M2P2 TEXT NOT NULL,
		M3P1 TEXT,
		M3P2 TEXT,
		M1P1Score INTEGER,
		M1P2Score INTEGER,
		M2P1Score INTEGER,
		M2P2Score INTEGER,
		M3P1Score INTEGER,
		M3P2Score INTEGER
		);`);
}

export function getTournamentByCode(db: DatabaseSync, code: string) {
	try {
		const select = db.prepare("SELECT * FROM Tournaments WHERE Code = ?");
		const tournament = select.get(code);
		if (tournament) {
			return {
				id: tournament.TournamentID,
				code,
				match: tournament.Match,
				m1p1: tournament.M1P1,
				m1p2: tournament.M1P2,
				m2p1: tournament.M2P1,
				m2p2: tournament.M2P2,
				m3p1: tournament.M3P1,
				m3p2: tournament.M3P2,
				m1p1Score: tournament.M1P1Score,
				m1p2Score: tournament.M1P2Score,
				m2p1Score: tournament.M2P1Score,
				m2p2Score: tournament.M2P2Score,
				m3p1Score: tournament.M3P1Score,
				m3p2Score: tournament.M3P2Score
			}
		}
		return {
			code: 404,
			error: "ERR_UNKNOWN_TOURNAMENT"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function addTournament(db: DatabaseSync, { code, m1p1, m1p2, m2p1, m2p2 }) {
	try {
		const select = db.prepare("INSERT INTO Tournaments (Code, M1P1, M1P2, M2P1, M2P2) VALUES (?, ?, ?, ?, ?)");
		select.run(code, m1p1, m1p2, m2p1, m2p2);
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

export function updateTournament(db: DatabaseSync, { user, code, p1Score, p2Score }) {
	try {
		const tournament = getTournamentByCode(db, code);
		const match = tournament.match as number + 1;
		if (match < 3) {
			let winner: string;
			let loser: string;
			if (1 == match) {
				winner = p1Score > p2Score ? tournament.m1p1 as string : tournament.m1p2 as string;
				loser = p1Score < p2Score ? tournament.m1p1 as string : tournament.m1p2 as string;
			}
			else if (2 == match) {
				winner = p1Score > p2Score ? tournament.m2p1 as string : tournament.m2p2 as string;
				loser = p1Score < p2Score ? tournament.m2p1 as string : tournament.m2p2 as string;
			}
			const select = db.prepare(`UPDATE Tournaments SET Match = ?, M${match}P1Score = ?, M${match}P2Score = ?, M3P${match} = ? WHERE TournamentID = ?;`);
			select.run(match, p1Score, p2Score, winner, tournament.id);

			if (user.nick == winner) {
				addMatch(db, {
					id: user.id,
					message: "won",
					rating: 2
				});
			}
			else if (user.nick == loser) {
				addMatch(db, {
					id: user.id,
					message: "lost",
					rating: 0
				});
			}

			return {
				code: 200,
				message: "SUCCESS"
			};
		}
		else {
			const winner = p1Score > p2Score ? tournament.m3p1 as string : tournament.m3p2 as string;
			const loser = p1Score < p2Score ? tournament.m3p1 as string : tournament.m3p2 as string;
			const select = db.prepare(`UPDATE Tournaments SET Match = ?, M${match}P1Score = ?, M${match}P2Score = ? WHERE TournamentID = ?;`);
			select.run(match, p1Score, p2Score, tournament.id);
			if (user.nick == winner) {
				addMatch(db, {
					id: user.id,
					message: "won tournament",
					rating: 3
				});
			}
			return {
				code: 200,
				message: "SUCCESS"
			};
		}
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}
