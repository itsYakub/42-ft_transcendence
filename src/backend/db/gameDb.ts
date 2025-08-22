import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Game, Gamer, Result, User } from "../../common/interfaces.js";

export function getGames(db: DatabaseSync) {
	try {
		const select = db.prepare("SELECT game_id, GROUP_CONCAT(nick) AS nicks FROM users WHERE NOT game_id IS NULL GROUP BY game_id");
		const games: Game[] = select.all().map(game => sqlToGame(game));
		return {
			result: Result.SUCCESS,
			games
		};
	}
	catch (e) {console.log(e);
		return {
			result: Result.ERR_DB
		};
	}
}

export function gamePlayers(db: DatabaseSync, gameId: string) {
	try {
		const select = db.prepare("SELECT user_id, nick, ready FROM users WHERE game_id IS ?");
		const gamers: Gamer[] = select.all(gameId).map(gamer => sqlToGamer(gamer));
		return {
			result: Result.SUCCESS,
			gamers
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

function addToGame(db: DatabaseSync, user: User) {
	try {
		const select = db.prepare(`UPDATE users SET game_id = ? WHERE user_id = ?;`);
		select.run(user.gameId, user.userId);
		return {
			result: Result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function joinGame(db: DatabaseSync, gameId: string, user: User) {
	try {
		let select = db.prepare(`SELECT COUNT(game_id) AS count FROM users WHERE game_id = ?`);
		const game = select.get(gameId);

		if (user.gameId != gameId && (2 == game.count && gameId.startsWith("m") || 4 == game.count && gameId.startsWith("t")))
			return {
				result: Result.ERR_GAME_FULL
			};

		user.gameId = gameId;
		return addToGame(db, user);
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function leaveGame(db: DatabaseSync, userId: number) {
	try {
		let select = db.prepare(`UPDATE users SET game_id = NULL, ready = 0 WHERE user_id = ?`);
		select.run(userId);
		//select = db.prepare("SELECT COUNT(game_id) as gameCount FROM Users WHERE game_id = ?");
		//const { gameCount } = select.get(gameID);
		// if (0 == gameCount) {
		// 	select = db.prepare("DELETE FROM Messages Where ToID = ?");
		// 	select.run(gameID);
		// }
		return {
			result: Result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function markReady(db: DatabaseSync, userId: number) {
	try {
		const select = db.prepare(`UPDATE users SET ready = 1 WHERE user_id = ?`);
		select.run(userId);
		return {
			result: Result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function countReady(db: DatabaseSync, { gameId }) {
	try {
		const select = db.prepare(`SELECT COUNT(Ready) as ready FROM users WHERE game_id = ? AND ready = 1`);
		const { ready } = select.get(gameId);
		const gameCount = gameId.startsWith("t") ? 4 : 2
		return {
			result: Result.SUCCESS,
			ready: gameCount == ready,
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function markPlaying(db: DatabaseSync, { gameId }) {
	try {
		const select = db.prepare(`UPDATE users SET playing = 1 WHERE game_id = ?`);
		select.run(gameId);
		return {
			result: Result.SUCCESS
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

function sqlToGame(game: Record<string, SQLOutputValue>): Game {
	console.log(game);
	return {
		gameId: game.game_id as string,
		nicks: game.nicks as string
	};

	// 	return {
	// 	gameId: game.game_id as string,
	// 	nicks: [].slice.call(game.nicks)
	// };
}

function sqlToGamer(gamer: Record<string, SQLOutputValue>): Gamer {
	return {
		nick: gamer.nick as string,
		ready: gamer.ready as number,
		userId: gamer.user_id as number
	};
}
