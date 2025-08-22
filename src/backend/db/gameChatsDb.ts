import { DatabaseSync } from "node:sqlite";
import { Result, WebsocketMessage } from "../../common/interfaces.js";

export function initGameChatsDb(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS game_chats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		game_id TEXT NOT NULL,
		from_id INTEGER NOT NULL,
		chat TEXT NOT NULL,
		sent_at TEXT NOT NULL
		);`);
}

/*
	Gets all the game's messages
*/
export function gameChats(db: DatabaseSync, gameId: string): any {
	try {
		const select = db.prepare("SELECT from_id, chat, nick FROM game_chats INNER JOIN users ON users.user_id = game_chats.from_id WHERE game_chats.game_id = ? ORDER BY sent_at DESC");
		const chats = select.all(gameId);
		return {
			result: Result.SUCCESS,
			chats
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Adds a message to the game (lobby)
*/
export function addGameChat(db: DatabaseSync, message: WebsocketMessage): any {
	try {
		const select = db.prepare("INSERT INTO game_chats (game_id, from_id, message, sent_at) VALUES (?, ?, ?, ?)");
		select.run(message.gameId, message.fromId, message.chat, new Date().toISOString());
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
