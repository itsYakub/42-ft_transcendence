import { DatabaseSync } from "node:sqlite";
import { Result, WebsocketMessage } from "../../common/interfaces.js";

export function initUserChatsDb(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS user_chats (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		from_id INTEGER NOT NULL,
		to_id INTEGER NOT NULL,
		message TEXT NOT NULL,
		sent_at TEXT NOT NULL
		);`);
}

/*
	Gets a list of ids that are in a private chat with the user
*/
export function getMessageSenders(db: DatabaseSync, { userId }) {
	try {
		const select = db.prepare("SELECT to_id, from_id FROM user_chats WHERE to_id = ? OR from_id = ?");
		const messages = select.all(userId, userId);

		const ids = [];

		messages.forEach((message) => {
			if (userId == message.ToID && !ids.includes(message.FromID))
				ids.push(message.FromID);
			if (userId == message.FromID && !ids.includes(parseInt(message.ToID as string)) && !isNaN(parseInt(message.ToID as string)))
				ids.push(parseInt(message.ToID as string));
		});

		return {
			result: Result.SUCCESS,
			ids
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

/*
	Gets all the user's messages
*/
export function userMessages(db: DatabaseSync, { userId, otherUserId }): any {
	try {
		const select = db.prepare("SELECT * FROM user_chats WHERE (to_id = ? AND from_id = ?) OR (from_id = ? AND to_id = ?) ORDER BY sent_at DESC");
		const messages = select.all(userId, otherUserId, userId, otherUserId);
		return {
			result: Result.SUCCESS,
			messages
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

/*
	Adds a private message (DM)
*/
export function addUserChat(db: DatabaseSync, message: WebsocketMessage ): any {
	try {
		const select = db.prepare("INSERT INTO user_chats (to_id, from_id, message, sent_at) VALUES (?, ?, ?, ?)");
		select.run(message.toId, message.fromId, message.chat, new Date().toISOString());
		return {
			result: Result.SUCCESS,
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}
