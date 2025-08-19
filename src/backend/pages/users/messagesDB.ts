import { DatabaseSync } from "node:sqlite";

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
export function getMessageSenders(db: DatabaseSync, { id }) {
	try {
		const select = db.prepare("SELECT ToID, FromID FROM PrivateMessages WHERE ToID = ? OR FromID = ?");
		const messages = select.all(id, id);

		const ids = [];

		messages.forEach((message) => {
			if (id == message.ToID && !ids.includes(message.FromID))
				ids.push(message.FromID);
			if (id == message.FromID && !ids.includes(parseInt(message.ToID as string)) && !isNaN(parseInt(message.ToID as string)))
				ids.push(parseInt(message.ToID as string));
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
export function privateMessages(db: DatabaseSync, userID: number, otherID: number): any {
	try {
		const select = db.prepare("SELECT * FROM PrivateMessages WHERE (ToID = ? AND FromID = ?) OR (FromID = ? AND ToID = ?) ORDER BY SentAt DESC");
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
	Adds a private message (DM)
*/
export function addPrivateMessage(db: DatabaseSync, { toID, fromID, message }): any {
	try {
		const select = db.prepare("INSERT INTO PrivateMessages (ToID, FromID, Message, SentAt) VALUES (?, ?, ?, ?)");
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
