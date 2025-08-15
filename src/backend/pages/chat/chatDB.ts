import { DatabaseSync } from "node:sqlite";

/**
 * Represents a single chat message between two users.
 */
export interface ChatMessage {
	sender: string;
	recipient: string;
	message: string;
}

/**
 * Initializes the Chats table.
 * If `dropChats` is true, the table is dropped and recreated.
 */
export function initChats(db: DatabaseSync, dropChats: boolean): void {
	if (dropChats)
		db.exec(`DROP TABLE IF EXISTS Chats;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Chats (
			ID INTEGER PRIMARY KEY AUTOINCREMENT,
			Sender TEXT NOT NULL,
			Recipient TEXT NOT NULL,
			Message TEXT NOT NULL
		);
	`);
}

/**
 * Inserts a message into the Chats table.
 */
export function addMessage(db: DatabaseSync, { sender, recipient, message }: ChatMessage): { message: string } | { code: number; error: string } {
	try {
		const insert = db.prepare("INSERT INTO Chats (Sender, Recipient, Message) VALUES (?, ?, ?)");
		const result = insert.run(sender, recipient, message);
		console.debug(result);

		return { message: 'Rows affected: ' + result.changes };
	} catch (e) {
		console.error("Error inserting chat message:", e);
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}
