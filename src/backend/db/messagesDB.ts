import { DatabaseSync } from "node:sqlite";
import { result } from "../../common/interfaces.js";

export function initPrivateMessages(db: DatabaseSync): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS PrivateMessages (
		MessageID INTEGER PRIMARY KEY AUTOINCREMENT,
		FromID INTEGER NOT NULL,
		ToID INTEGER NOT NULL,
		Message TEXT NOT NULL,
		SentAt TEXT NOT NULL
		);`);
}

/*
	Gets a list of ids that are in a private chat with the user
*/
export function getMessageSenders(db: DatabaseSync, { userId }) {
	try {
		const select = db.prepare("SELECT ToID, FromID FROM PrivateMessages WHERE ToID = ? OR FromID = ?");
		const messages = select.all(userId, userId);

		const ids = [];

		messages.forEach((message) => {
			if (userId == message.ToID && !ids.includes(message.FromID))
				ids.push(message.FromID);
			if (userId == message.FromID && !ids.includes(parseInt(message.ToID as string)) && !isNaN(parseInt(message.ToID as string)))
				ids.push(parseInt(message.ToID as string));
		});

		return {
			result: result.SUCCESS,
			ids
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB,
		};
	}
}

/*
	Gets all the user's messages
*/
export function privateMessages(db: DatabaseSync, { userId, otherUserId }): any {
	try {
		const select = db.prepare("SELECT * FROM PrivateMessages WHERE (ToID = ? AND FromID = ?) OR (FromID = ? AND ToID = ?) ORDER BY SentAt DESC");
		const messages = select.all(userId, otherUserId, userId, otherUserId);
		return {
			result: result.SUCCESS,
			messages
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB,
		};
	}
}

/*
	Adds a private message (DM)
*/
export function addPrivateMessage(db: DatabaseSync, { toID, fromID, message }): any {
	try {
		const select = db.prepare("INSERT INTO PrivateMessages (ToID, FromID, Message, SentAt) VALUES (?, ?, ?, ?)");
		select.run(toID, fromID, message, new Date().toISOString());
		return {
			result: result.SUCCESS,
		};
	}
	catch (e) {
		return {
			result: result.ERR_DB,
		};
	}
}
