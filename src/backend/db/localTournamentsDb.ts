import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Gamer, TournamentMatch, MatchGamer, Result, Tournament, User, LocalMatch, LocalGamer, LocalTournament } from "../../common/interfaces.js";
import { updateGameId } from "./gameDb.js";

export function initLocalTournamentsDb(db: DatabaseSync) {
	db.exec(`DROP TABLE IF EXISTS local_tournaments;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS local_tournaments (
		game_id TEXT PRIMARY KEY UNIQUE,
		m1_g1_nick TEXT,
		m1_g2_nick TEXT,
		m2_g1_nick TEXT,
		m2_g2_nick TEXT,
		m3_g1_nick TEXT,
		m3_g2_nick TEXT,
		m1_g1_score INTEGER DEFAULT 0,
		m1_g2_score INTEGER DEFAULT 0,
		m2_g1_score INTEGER DEFAULT 0,
		m2_g2_score INTEGER DEFAULT 0,
		m3_g1_score INTEGER DEFAULT 0,
		m3_g2_score INTEGER DEFAULT 0,
		user_id INTEGER
		);`);
}

export function getLocalTournament(db: DatabaseSync, gameId: string): Box<LocalTournament> {
	try {
		const select = db.prepare("SELECT * FROM local_tournaments WHERE game_id = ?");
		const tournament = sqlToLocalTournament(select.get(gameId));
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

export function addLocalTournament(db: DatabaseSync, gamers: string[], user: User): Result {
	try {
		const select = db.prepare("INSERT INTO local_tournaments (game_id, m1_g1_nick, m1_g2_nick, m2_g1_nick, m2_g2_nick, user_id) VALUES (?, ?, ?, ?, ?, ?)");
		select.run(user.gameId, gamers[0], gamers[1], gamers[2], gamers[3], user.userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function joinLocalTournament(db: DatabaseSync, gameId: string, user: User): Result {
	try {
		let select = db.prepare(`SELECT COUNT(game_id) AS count FROM users WHERE game_id = ?`);
		const game = select.get(gameId);

		if (user.gameId != gameId && 4 == game.count)
			return Result.ERR_GAME_FULL;

		user.gameId = gameId;
		return updateGameId(db, user);
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateLocalTournament(db: DatabaseSync, gameId: string, match: LocalMatch): Result {
	try {
		let select = db.prepare(`UPDATE local_tournaments SET m${match.matchNumber}_g1_score = ?, m${match.matchNumber}_g2_score = ? WHERE game_id = ?;`);
		select.run(match.g1.score, match.g2.score, gameId);
		if (match.matchNumber < 3) {
			const nick = match.g1.score > match.g2.score ? match.g1.nick : match.g2.nick;
			let select = db.prepare(`UPDATE local_tournaments SET m3_g${match.matchNumber}_nick = ? WHERE game_id = ?;`);
			select.run(nick, gameId);
		}
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

// export function updateTournamentFinal(db: DatabaseSync, gameId: string, matches: TournamentMatch[]): Result {
// 	try {
// 		if ((matches[0].g1.score + matches[0].g2.score > 0) && (matches[0].g1.score + matches[0].g2.score > 0)) {
// 			const g1 = matches[0].g1.score > matches[0].g2.score ? matches[0].g1 : matches[0].g2;
// 			const g2 = matches[1].g1.score > matches[1].g2.score ? matches[1].g1 : matches[1].g2;
// 			const select = db.prepare(`UPDATE tournaments SET m1_g1_nick = NULL, m1_g2_nick = NULL,
// 				m2_g1_nick = NULL, m2_g2_nick = NULL, m1_g1_user_id = NULL, m1_g2_user_id = NULL,
// 				m2_g1_user_id = NULL, m2_g2_user_id = NULL,
// 				m3_g1_nick = ?, m3_g2_nick = ?, m3_g1_user_id = ?, m3_g2_user_id = ? WHERE game_id = ?`);
// 			select.run(g1.nick, g2.nick, g1.userId, g2.userId, gameId);
// 			return Result.SUCCESS;
// 		}
// 	}
// 	catch (e) {
// 		return Result.ERR_DB;
// 	}
// }

function sqlToLocalTournament(tournament: Record<string, SQLOutputValue>): LocalTournament {
	return {
		matches: [
			sqlToLocalMatch(tournament, 1),
			sqlToLocalMatch(tournament, 2),
			sqlToLocalMatch(tournament, 3)
		]
	}
}

function sqlToLocalMatch(tournament: Record<string, SQLOutputValue>, matchNumber: number): LocalMatch {
	return {
		g1: sqlToLocalGamer(tournament, matchNumber, 1),
		g2: sqlToLocalGamer(tournament, matchNumber, 2),
		matchNumber
	}
}

function sqlToLocalGamer(tournament: Record<string, SQLOutputValue>, matchNumber: number, gamerNumber: number): LocalGamer {
	return {
		nick: tournament[`m${matchNumber}_g${gamerNumber}_nick`] as string,
		score: tournament[`m${matchNumber}_g${gamerNumber}_score`] as number,
		userId: tournament[`m${matchNumber}_g${gamerNumber}_user_id`] as number
	}
}
