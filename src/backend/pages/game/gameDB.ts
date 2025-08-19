import { DatabaseSync } from "node:sqlite";

export function initGameMessages(db: DatabaseSync, dropMessages: boolean): void {
	if (dropMessages)
		db.exec(`DROP TABLE IF EXISTS GameMessages;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS GameMessages (
		MessageID INTEGER PRIMARY KEY AUTOINCREMENT,
		FromID INTEGER NOT NULL,
		ToID TEXT NOT NULL,
		Message TEXT NOT NULL,
		SentAt TEXT NOT NULL
		);`);
}

export function getGames(db: DatabaseSync) {
	try {
		const select = db.prepare("SELECT GameID, GROUP_CONCAT(Nick) AS Nicks FROM USERS WHERE NOT GameID IS NULL GROUP BY GameID");
		const result = select.all();
		return {
			code: 200,
			games: result
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function gamePlayers(db: DatabaseSync, { gameID }) {
	try {
		const select = db.prepare("SELECT UserID, Nick, Ready FROM USERS WHERE GameID IS ?");
		const gamers = select.all(gameID);
		return {
			code: 200,
			message: "SUCCESS",
			gamers
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function addToGame(db: DatabaseSync, { gameID, user }) {
	try {
		if (user.gameID != gameID) {
			const select = db.prepare(`UPDATE Users SET GameID = ? WHERE UserID = ?;`);
			select.run(gameID, user.id);
		}
		return {
			code: 200,
			message: "SUCCESS",
			gameID
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function joinGame(db: DatabaseSync, { gameID, user }) {
	try {
		let select = db.prepare(`SELECT COUNT(GameID) AS count FROM Users WHERE GameID = ?`);
		const result = select.get(gameID);
		if (0 == result.count)
			return {
				code: 404,
				error: "ERR_NOT_FOUND"
			};

		if (user.gameID != gameID && (2 == result.count && gameID.startsWith("m") || 4 == result.count && gameID.startsWith("t")))
			return {
				code: 423,
				error: "ERR_FULL"
			};

		return addToGame(db, {
			gameID,
			user
		});
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function leaveGame(db: DatabaseSync, { id, gameID }) {
	try {
		let select = db.prepare(`UPDATE Users SET GameID = NULL, Ready = 0 WHERE UserID = ?`);
		select.run(id);
		//select = db.prepare("SELECT COUNT(GameID) as gameCount FROM Users WHERE GameID = ?");
		//const { gameCount } = select.get(gameID);
		// if (0 == gameCount) {
		// 	select = db.prepare("DELETE FROM Messages Where ToID = ?");
		// 	select.run(gameID);
		// }
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

export function markReady(db: DatabaseSync, { id }) {
	try {
		const select = db.prepare(`UPDATE Users SET Ready = 1 WHERE UserID = ?`);
		select.run(id);
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

export function countReady(db: DatabaseSync, { gameID }) {
	try {
		const select = db.prepare(`SELECT COUNT(Ready) as Ready FROM Users WHERE GameID = ? AND Ready = 1`);
		const { Ready: ready } = select.get(gameID);
		const gameCount = gameID.startsWith("t") ? 4 : 2
		return {
			code: 200,
			message: "SUCCESS",
			ready: gameCount == ready,
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function markPlaying(db: DatabaseSync, { gameID }) {
	try {
		const select = db.prepare(`UPDATE Users SET Playing = 1 WHERE GameID = ?`);
		select.run(gameID);
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

/*
	Gets all the game's messages
*/
export function gameMessages(db: DatabaseSync, { gameID }): any {
	try {
		const select = db.prepare("SELECT FromID, Message, Nick FROM GameMessages INNER JOIN Users ON Users.UserID = GameMessages.FromID WHERE ToID = ? ORDER BY SentAt DESC");
		const messages = select.all(gameID);
		return {
			code: 200,
			messages
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Adds a message to the game (lobby)
*/
export function addGameMessage(db: DatabaseSync, { toID, fromID, message }): any {
	try {
		const select = db.prepare("INSERT INTO GameMessages (ToID, FromID, Message, SentAt) VALUES (?, ?, ?, ?)");
		select.run(toID, fromID, message, new Date().toISOString());
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
