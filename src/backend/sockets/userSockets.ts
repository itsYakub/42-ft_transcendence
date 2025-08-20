import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { markUserOnline } from '../user/userDB.js';
import { addPrivateMessage } from '../pages/users/messagesDB.js';
import { broadcastMessageToClients } from './serverSockets.js';

export function handleUserMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	switch (message.type) {
		case "user-log-in":
			useLoginReceived(fastify, db, user, message);
			break;
		case "user-chat":
			userChatReceived(fastify, db, user, message);
			break;
		case "user-invite":
			userInviteReceived(fastify, db, user, message);
			break;
		case "user-change-status":
			userChangeStatusReceived(fastify, db, user, message);
			break;
	}
}

function useLoginReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	console.log(`${user.nick} logged in`);
	markUserOnline(db, user);
	broadcastMessageToClients(fastify, {
		type: "user-change-status",
		fromID: user.id,
		online: 1
	});
}

function userChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	if (0 == message.toID)
		return;

	const response = addPrivateMessage(db, {
		toID: message.toID,
		fromID: user.id,
		message: message.chat
	});

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "user-chat",
			ids: [
				message.toID as number,
				user.id
			],
			fromID: user.id,
			toID: message.toID as number,
			chat: message.chat
		});
	}
}

function userInviteReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	broadcastMessageToClients(fastify, {
		type: "user-invite",
		toID: message.toID,
		gameID: user.gameID
	});
}

function userChangeStatusReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	console.log(message);
}
