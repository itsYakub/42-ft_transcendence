import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Gamer, MatchGamer, Result, User, Match } from "../../common/interfaces.js";
import { updateGameId } from "./gameDb.js";

export function initMatchesDb(db: DatabaseSync) {
	db.exec(`DROP TABLE IF EXISTS matches;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS matches (
		game_id TEXT PRIMARY KEY UNIQUE,
		g1_nick TEXT,
		g2_nick TEXT,
		g1_ready INTEGER DEFAULT 0,
		g2_ready INTEGER DEFAULT 0,
		g1_score INTEGER DEFAULT 0,
		g2_score INTEGER DEFAULT 0,
		g1_user_id INTEGER,
		g2_user_id INTEGER,
		tournament_final INTEGER DEFAULT 0
		);`);
}

export function getMatch(db: DatabaseSync, gameId: string): Box<Match> {
	try {
		const select = db.prepare("SELECT * FROM matches WHERE game_id = ?");
		const match = sqlToMatch(select.get(gameId));
		return {
			result: Result.SUCCESS,
			contents: match
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function joinMatch(db: DatabaseSync, user: User): Result {
	try {
		const match = getMatch(db, user.gameId);
		if (Result.SUCCESS == match.result) {
			console.log("exists", match);
			const select = db.prepare("INSERT INTO matches (game_id, g2_nick, g2_user_id) VALUES (?, ?, ?)");
			select.run(user.gameId, user.nick, user.userId);
		}
		// let select = db.prepare(`SELECT COUNT(game_id) AS count FROM matches WHERE game_id = ?`);
		// const game = select.get(user.gameId);

		else {
			console.log("doesn't exist");
			const select = db.prepare("INSERT INTO matches (game_id, g1_nick, g1_user_id) VALUES (?, ?, ?)");
			select.run(user.gameId, user.nick, user.userId);
		}
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function markMatchGamerReady(db: DatabaseSync, user: User): Result {
	try {
		const select = db.prepare(`UPDATE matches SET g1_ready = 1 WHERE game_id = ?;`);
		select.run(user.gameId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToMatch(match: Record<string, SQLOutputValue>): Match {
	return null == match.g2_nick as string ? {
		g1: sqlToMatchGamer(match, 1),
		g2: null
	}
		: {
			g1: sqlToMatchGamer(match, 1),
			g2: sqlToMatchGamer(match, 2)
		}
}

function sqlToMatchGamer(match: Record<string, SQLOutputValue>, gamerNumber: number): MatchGamer {
	return {
		nick: match[`g${gamerNumber}_nick`] as string,
		ready: Boolean(match[`g${gamerNumber}_ready`] as number),
		score: match[`g${gamerNumber}_score`] as number,
		userId: match[`g${gamerNumber}_user_id`] as number
	}
}
