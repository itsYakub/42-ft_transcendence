import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Gamer, Result, Tournament, User } from "../../common/interfaces.js";

export function initTournamentsDb(db: DatabaseSync) {
	db.exec(`DROP TABLE IF EXISTS tournaments;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS tournaments (
		final_g1_score INTEGER,
		final_g2_score INTEGER,
		g1_id INTEGER NOT NULL,
		g2_id INTEGER NOT NULL,
		g3_id INTEGER NOT NULL,
		g4_id INTEGER NOT NULL,
		g1_nick TEXT NOT NULL,
		g2_nick TEXT NOT NULL,
		g3_nick TEXT NOT NULL,
		g4_nick TEXT NOT NULL,
		g1_status INTEGER NOT NULL DEFAULT 0,
		g2_status INTEGER NOT NULL DEFAULT 0,
		g3_status INTEGER NOT NULL DEFAULT 0,
		g4_status INTEGER NOT NULL DEFAULT 0,
		game_id TEXT PRIMARY KEY UNIQUE,
		match_a_g1_score INTEGER,
		match_a_g2_score INTEGER,
		match_b_g1_score INTEGER,
		match_b_g2_score INTEGER
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
		const select = db.prepare("INSERT INTO tournaments (game_id, g1_id, g2_id, g3_id, g4_id, g1_nick, g2_nick, g3_nick, g4_nick) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
		select.run(gameId, gamers[0].userId, gamers[1].userId, gamers[2].userId, gamers[3].userId, gamers[0].nick, gamers[1].nick, gamers[2].nick, gamers[3].nick);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToTournament(tournament: Record<string, SQLOutputValue>): Tournament {
	// return {

	// }


	return {
		finalG1Score: tournament.final_g1_score as number,
		finalG2Score: tournament.final_g2_score as number,
		g1Id: tournament.g1_id as number,
		g2Id: tournament.g2_id as number,
		g3Id: tournament.g3_id as number,
		g4Id: tournament.g4_id as number,
		g1Nick: tournament.g1_nick as string,
		g2Nick: tournament.g2_nick as string,
		g3Nick: tournament.g3_nick as string,
		g4Nick: tournament.g4Nick as string,
		matchAG1Score: tournament.match_a_g1_score as number,
		matchAG2Score: tournament.match_a_g2_score as number,
		matchBG1Score: tournament.match_b_g1_score as number,
		matchBG2Score: tournament.match_b_g2_score as number,
	};
}

// function sqlToGamer(tournament: Record<string, SQLOutputValue>, index: number): Gamer {
// 	return {
// 		nick: tournament.g1_nick as string,
// 		userId: tournament.g1_id as number,
// 	}
// }
