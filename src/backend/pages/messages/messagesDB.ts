import { DatabaseSync } from "node:sqlite";

export function initMessages(db: DatabaseSync, dropMessages: boolean): void {
	if (dropMessages)
		db.exec(`DROP TABLE IF EXISTS Messages;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Messages (
		MessageID INTEGER PRIMARY KEY AUTOINCREMENT,
		ToID TEXT NOT NULL,
		FromID INTEGER NOT NULL,
		Message TEXT NOT NULL,
		SentAt TEXT NOT NULL
		);`);
}

/*
	Gets a list of ids that are in a private chat with the user
*/
export function getMessageSenders(db: DatabaseSync, { id }) {
	try {
		const select = db.prepare("SELECT ToID, FromID FROM Messages WHERE ToID = ? OR FromID = ?");
		const messages = select.all(id, id);

		const ids = [];

		messages.forEach((message) => {
			if (id == message.ToID && !ids.includes(message.FromID))
				ids.push(message.FromID);
			if (id == message.FromID && !ids.includes(message.ToID))
				ids.push(message.ToID);
		});

		return {
			code: 200,
			ids
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
	Gets all the user's messages
*/
export function getMessages(db: DatabaseSync, userID: number, otherID: number): any {
	try {
		const select = db.prepare("SELECT * FROM Messages WHERE (ToID = ? AND FromID = ?) OR (FromID = ? AND ToID = ?) ORDER BY SentAt DESC");
		const messages = select.all(userID, otherID, userID, otherID);
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
	Gets all the room's messages
*/
export function roomMessages(db: DatabaseSync, { roomID }): any {
	try {
		const select = db.prepare("SELECT FromID, Message, Nick FROM Messages INNER JOIN Users ON Users.UserID = Messages.FromID WHERE ToID = ? ORDER BY SentAt DESC");
		const messages = select.all(roomID);
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
	Adds a private message (DM)
*/
export function addMessage(db: DatabaseSync, { toID, fromID, message }): any {
	try {
		const select = db.prepare("INSERT INTO Messages (ToID, FromID, Message, SentAt) VALUES (?, ?, ?, ?)");
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
