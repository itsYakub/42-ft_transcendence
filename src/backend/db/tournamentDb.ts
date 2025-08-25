import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Gamer, Result, Tournament, User } from "../../common/interfaces.js";

export function initTournamentsDb(db: DatabaseSync) {
	db.exec(`DROP TABLE IF EXISTS tournaments;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS tournaments (
		game_id TEXT PRIMARY KEY UNIQUE,
		match INTEGER NOT NULL DEFAULT 0,
		m1p1_nick TEXT NOT NULL,
		m1p2_nick TEXT NOT NULL,
		m2p1_nick TEXT NOT NULL,
		m2p2_nick TEXT NOT NULL,
		m3p1_nick TEXT,
		m3p2_nick TEXT,
		m1p1_score INTEGER,
		m1p2_score INTEGER,
		m2p1_score INTEGER,
		m2p2_score INTEGER,
		m3p1_score INTEGER,
		m3p2_score INTEGER
		);`);
}

export function getTournament(db: DatabaseSync, gameId: number): Box<Tournament> {
	try {
		const select = db.prepare("SELECT * FROM tournaments WHERE game_id = ?");
		const tournament = sqlToTournament(select.get(gameId));
		return {
			result: Result.SUCCESS,
			contents: tournament
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function addTournament(db: DatabaseSync, gameId: string, gamers: Gamer[]): Result {
	try {
		const select = db.prepare("INSERT INTO Tournaments (game_id, m1p1_nick, m1p2_nick, m2p1_nick, m2p2_nick) VALUES (?, ?, ?, ?, ?)");
		select.run(gameId, gamers[0].nick, gamers[1].nick, gamers[2].nick, gamers[3].nick);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToTournament(tournament: Record<string, SQLOutputValue>): Tournament {
	return {
		match: tournament.match as number,
		m1p1Nick: tournament.m1p1_nick as string,
		m1p2Nick: tournament.m1p2_nick as string,
		m2p1Nick: tournament.m2p1_nick as string,
		m2p2Nick: tournament.m2p2_nick as string,
		m3p1Nick: tournament.m3p1_nick as string,
		m3p2Nick: tournament.m3p2_nick as string,
		m1p1Score: tournament.m1p1_score as number,
		m1p2Score: tournament.m1p2_score as number,
		m2p1Score: tournament.m2p1_score as number,
		m2p2Score: tournament.m2p2_score as number,
		m3p1Score: tournament.m3p1_score as number,
		m3p2Score: tournament.m3p2_score as number,
	};
}
