import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Gamer, TournamentMatch, MatchGamer, Result, Tournament, User } from "../../common/interfaces.js";
import { updateGameId } from "./gameDb.js";

export function initTournamentsDb(db: DatabaseSync) {
	db.exec(`DROP TABLE IF EXISTS tournaments;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS tournaments (
		game_id TEXT PRIMARY KEY UNIQUE,
		m1_g1_nick TEXT,
		m1_g2_nick TEXT,
		m2_g1_nick TEXT,
		m2_g2_nick TEXT,
		m3_g1_nick TEXT,
		m3_g2_nick TEXT,
		m1_g1_ready INTEGER DEFAULT 0,
		m1_g2_ready INTEGER DEFAULT 0,
		m2_g1_ready INTEGER DEFAULT 0,
		m2_g2_ready INTEGER DEFAULT 0,
		m3_g1_ready INTEGER DEFAULT 0,
		m3_g2_ready INTEGER DEFAULT 0,
		m1_g1_score INTEGER DEFAULT 0,
		m1_g2_score INTEGER DEFAULT 0,
		m2_g1_score INTEGER DEFAULT 0,
		m2_g2_score INTEGER DEFAULT 0,
		m3_g1_score INTEGER DEFAULT 0,
		m3_g2_score INTEGER DEFAULT 0,
		m1_g1_user_id INTEGER,
		m1_g2_user_id INTEGER,
		m2_g1_user_id INTEGER,
		m2_g2_user_id INTEGER,
		m3_g1_user_id INTEGER,
		m3_g2_user_id INTEGER
		);`);
}

export function getTournament(db: DatabaseSync, gameId: string): Box<Tournament> {
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
		const select = db.prepare("INSERT INTO tournaments (game_id, m1_g1_user_id, m1_g2_user_id, m2_g1_user_id, m2_g2_user_id, m1_g1_nick, m1_g2_nick, m2_g1_nick, m2_g2_nick) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
		select.run(gameId, gamers[0].userId, gamers[1].userId, gamers[2].userId, gamers[3].userId, gamers[0].nick, gamers[1].nick, gamers[2].nick, gamers[3].nick);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function joinTournament(db: DatabaseSync, gameId: string, user: User): Result {
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

export function markTournamentGamerReady(db: DatabaseSync, tournament: Tournament, user: User): Result {
	const match = whichMatchIsUserIn(tournament, user);
	const player = match.g1.userId == user.userId ? 1 : 2;
	try {
		const select = db.prepare(`UPDATE tournaments SET m${match.matchNumber}_g${player}_ready = 1 WHERE game_id = ?;`);
		select.run(user.gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateTournamentMatchResult(db: DatabaseSync, gameId: string, match: TournamentMatch): Result {
	try {
		const select = db.prepare(`UPDATE tournaments SET m${match.matchNumber}_g1_score = ?, m${match.matchNumber}_g2_score = ? WHERE game_id = ?;`);
		select.run(match.g1.score, match.g2.score, gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function updateTournamentFinal(db: DatabaseSync, gameId: string, matches: TournamentMatch[]): Result {
	try {
		if ((matches[0].g1.score + matches[0].g2.score > 0) && (matches[0].g1.score + matches[0].g2.score > 0)) {
			const g1 = matches[0].g1.score > matches[0].g2.score ? matches[0].g1 : matches[0].g2;
			const g2 = matches[1].g1.score > matches[1].g2.score ? matches[1].g1 : matches[1].g2;
			const select = db.prepare(`UPDATE tournaments SET m1_g1_nick = NULL, m1_g2_nick = NULL,
				m2_g1_nick = NULL, m2_g2_nick = NULL, m1_g1_user_id = NULL, m1_g2_user_id = NULL,
				m2_g1_user_id = NULL, m2_g2_user_id = NULL,
				m3_g1_nick = ?, m3_g2_nick = ?, m3_g1_user_id = ?, m3_g2_user_id = ? WHERE game_id = ?`);
			select.run(g1.nick, g2.nick, g1.userId, g2.userId, gameId);
			return Result.SUCCESS;
		}
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function whichMatchIsUserIn(tournament: Tournament, user: User): TournamentMatch {
	return tournament.matches.find(match => match.g1.userId == user.userId || match.g2.userId == user.userId);
}

function sqlToTournament(tournament: Record<string, SQLOutputValue>): Tournament {
	return {
		matches: [
			sqlToMatch(tournament, 1),
			sqlToMatch(tournament, 2),
			sqlToMatch(tournament, 3)
		]
	}
}

function sqlToMatch(tournament: Record<string, SQLOutputValue>, matchNumber: number): TournamentMatch {
	return {
		g1: sqlToMatchGamer(tournament, matchNumber, 1),
		g2: sqlToMatchGamer(tournament, matchNumber, 2),
		matchNumber
	}
}

function sqlToMatchGamer(tournament: Record<string, SQLOutputValue>, matchNumber: number, gamerNumber: number): MatchGamer {
	return {
		nick: tournament[`m${matchNumber}_g${gamerNumber}_nick`] as string,
		ready: Boolean(tournament[`m${matchNumber}_g${gamerNumber}_ready`] as number),
		score: tournament[`m${matchNumber}_g${gamerNumber}_score`] as number,
		userId: tournament[`m${matchNumber}_g${gamerNumber}_user_id`] as number
	}
}
