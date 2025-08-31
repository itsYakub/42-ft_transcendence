import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Game, GameType, MatchGamer, Result, User } from "../../common/interfaces.js";

export function getGames(db: DatabaseSync): Box<Game[]> {
	try {
		const select = db.prepare("SELECT game_id, GROUP_CONCAT(nick) AS nicks FROM users WHERE NOT game_id IS NULL GROUP BY game_id");
		const games: Game[] = select.all().map(game => sqlToGame(game));
		return {
			result: Result.SUCCESS,
			contents: games
		};
	}
	catch (e) {
		console.log("getGames", e);
		return {
			result: Result.ERR_DB
		};
	}
}

export function gamePlayers(db: DatabaseSync, gameId: string): Box<MatchGamer[]> {
	try {
		const select = db.prepare("SELECT game_id, user_id, nick FROM users WHERE game_id IS ?");
		const gamers = select.all(gameId).map(gamer => sqlToGamer(gamer));
		return {
			result: Result.SUCCESS,
			contents: gamers
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function updateGameId(db: DatabaseSync, user: User): Result {
	try {
		const select = db.prepare(`UPDATE users SET game_id = ? WHERE user_id = ?;`);
		select.run(user.gameId, user.userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}



// export function markReady(db: DatabaseSync, userId: number): Result {
// 	try {
// 		const select = db.prepare(`UPDATE users SET ready = 1 WHERE user_id = ?`);
// 		select.run(userId);
// 		return Result.SUCCESS;
// 	}
// 	catch (e) {
// 		return Result.ERR_DB;;
// 	}
// }

// export function markUnReady(db: DatabaseSync, userId: number): Result {
// 	try {
// 		const select = db.prepare(`UPDATE users SET ready = 0 WHERE user_id = ?`);
// 		select.run(userId);
// 		return Result.SUCCESS;
// 	}
// 	catch (e) {
// 		return Result.ERR_DB;
// 	}
// }

// export function countReady(db: DatabaseSync, gameId: string): Box<boolean> {
// 	try {
// 		const select = db.prepare(`SELECT COUNT(Ready) as ready FROM users WHERE game_id = ? AND ready = 1`);
// 		const { ready } = select.get(gameId);
// 		const gameCount = gameId.startsWith("t") ? 4 : 2
// 		return {
// 			result: Result.SUCCESS,
// 			contents: gameCount == ready,
// 		};
// 	}
// 	catch (e) {
// 		return {
// 			result: Result.ERR_DB
// 		};
// 	}
// }

// export function markPlaying(db: DatabaseSync, { gameId }): Result {
// 	try {
// 		const select = db.prepare(`UPDATE users SET playing = 1 WHERE game_id = ?`);
// 		select.run(gameId);
// 		return Result.SUCCESS;
// 	}
// 	catch (e) {
// 		return Result.ERR_DB;
// 	}
// }

function sqlToGame(game: Record<string, SQLOutputValue>): Game {
	const gameId = game.game_id as string;
	return {
		gameId: gameId as string,
		nicks: game.nicks as string,
		type: gameId.startsWith("m") ? GameType.MATCH : GameType.TOURNAMENT
	};

	// 	return {
	// 	gameId: game.game_id as string,
	// 	nicks: [].slice.call(game.nicks)
	// };
}

function sqlToGamer(gamer: Record<string, SQLOutputValue>): MatchGamer {
	return {
		nick: gamer.nick as string,
		userId: gamer.user_id as number
	};
}
