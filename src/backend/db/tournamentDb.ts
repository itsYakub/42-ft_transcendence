import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Gamer, MatchStatus, Result, Tournament, TournamentGamer, User } from "../../common/interfaces.js";

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
		g1_ready INTEGER NOT NULL DEFAULT 0,
		g2_ready INTEGER NOT NULL DEFAULT 0,
		g3_ready INTEGER NOT NULL DEFAULT 0,
		g4_ready INTEGER NOT NULL DEFAULT 0,
		final_status INTEGER NOT NULL DEFAULT 0,
		game_id TEXT PRIMARY KEY UNIQUE,
		match_a_g1_score INTEGER,
		match_a_g2_score INTEGER,
		match_a_status INTEGER NOT NULL DEFAULT 0,
		match_b_g1_score INTEGER,
		match_b_g2_score INTEGER,
		match_b_status INTEGER NOT NULL DEFAULT 0
		);`);
}

export function getTournament(db: DatabaseSync, user: User): Box<Tournament> {
	try {
		const select = db.prepare("SELECT * FROM tournaments WHERE game_id = ?");
		const tournament = sqlToTournament(select.get(user.gameId), user);
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

export function markTournamentGamerReady(db: DatabaseSync, gameId: string, index: number): Result {
	const player = `g${index}_ready`;
	try {
		const select = db.prepare(`UPDATE tournaments SET ${player} = 1 WHERE game_id = ?;`);
		select.run(gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToTournament(tournament: Record<string, SQLOutputValue>, user: User): Tournament {
	const isPrimaryMatch = user.userId == tournament.g1_id as number || user.userId == tournament.g2_id as number;

	return isPrimaryMatch ?
		{
			primaryMatch: {
				gamer1: sqlToGamer(tournament, 0),
				gamer2: sqlToGamer(tournament, 1),
				matchStatus: tournament.match_a_status as number
			},
			secondaryMatch: {
				gamer1: sqlToGamer(tournament, 2),
				gamer2: sqlToGamer(tournament, 3),
				matchStatus: tournament.match_b_status as number
			}
		}
		:
		{
			primaryMatch: {
				gamer1: sqlToGamer(tournament, 2),
				gamer2: sqlToGamer(tournament, 3),
				matchStatus: tournament.match_a_status as number
			},
			secondaryMatch: {
				gamer1: sqlToGamer(tournament, 0),
				gamer2: sqlToGamer(tournament, 1),
				matchStatus: tournament.match_b_status as number
			}
		};
}

function sqlToGamer(tournament: Record<string, SQLOutputValue>, index: number): TournamentGamer {
	switch (index) {
		case 0:
			return {
				index: 1,
				nick: tournament.g1_nick as string,
				ready: Boolean(tournament.g1_ready as number),
				userId: tournament.g1_id as number,
			}
		case 1:
			return {
				index: 2,
				nick: tournament.g2_nick as string,
				ready: Boolean(tournament.g2_ready as number),
				userId: tournament.g2_id as number,
			}
		case 2:
			return {
				index: 3,
				nick: tournament.g3_nick as string,
				ready: Boolean(tournament.g3_ready as number),
				userId: tournament.g3_id as number,
			}
		default:
			return {
				index: 4,
				nick: tournament.g4_nick as string,
				ready: Boolean(tournament.g4_ready as number),
				userId: tournament.g4_id as number,
			}
	}
}
