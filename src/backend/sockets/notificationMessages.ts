import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { createInviteNotification } from '../../db/notificationsDb.js';

export function notificationInviteReceived(db: DatabaseSync, user: ShortUser, message: Message) {
	message.fromId = user.userId;
	const result = createInviteNotification(db, message);

	// if (Result.SUCCESS == result)
	// 	broadcastMessageToClients(message);
}
