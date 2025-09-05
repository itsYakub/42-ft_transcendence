import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { Box, Message, MessageType, Result, UserNotification } from "../../common/interfaces.js";

export function initNotificationsDb(db: DatabaseSync): void {
	db.exec(`DROP TABLE IF EXISTS notifications;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS notifications (
		from_id INTEGER NOT NULL,
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		notification_type TEXT NOT NULL,
		sent_at TEXT NOT NULL,
		to_id INTEGER NOT NULL
		);`);

	db.exec(`INSERT INTO notifications (from_id, notification_type, to_id, sent_at) VALUES (4, 'NOTIFICATION_INVITE',  11, '${new Date().toISOString()}');`);
	db.exec(`INSERT INTO notifications (from_id, notification_type, to_id, sent_at) VALUES (4, 'NOTIFICATION_TOURNAMENT',  11, '${new Date().toISOString()}');`);
}

export function notificationsList(db: DatabaseSync, userId: number): Box<UserNotification[]> {
	try {
		const select = db.prepare(`SELECT sent_at, notification_type, nick FROM notifications INNER JOIN users ON users.user_id = from_id WHERE to_id = ? ORDER BY sent_at DESC`);
		const notifications = select.all(userId).map(chat => sqlToNotification(chat));
		return {
			result: Result.SUCCESS,
			contents: notifications
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB,
		};
	}
}

export function addInviteNotification(db: DatabaseSync, message: Message): Result {
	try {
		const select = db.prepare("INSERT INTO notifications (from_id, to_id, type, sent_at) VALUES (?, ?, ?, ?)");
		select.run(message.fromId, message.toId, MessageType.NOTIFICATION_INVITE, new Date().toISOString());
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

function sqlToNotification(userChatMessage: Record<string, SQLOutputValue>): UserNotification {
	return {
		nick: userChatMessage.nick as string,
		sentAt: new Date(userChatMessage.sent_at as string),
		type: MessageType[userChatMessage.notification_type as string]
	};
}
