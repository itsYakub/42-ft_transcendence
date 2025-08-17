import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { markUserOnline } from '../pages/user/userDB.js';
import { addMessage } from '../pages/messages/messagesDB.js';
import { broadcastMessageToClients } from './serverSockets.js';

export function handleServerUserMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	switch (message.type) {
		case "user-logged-in": console.log(`${user.nick} logged in`);
			markUserOnline(db, user);
			break;
		case "user-chat":
			userChatReceived(fastify, db, user, message);
			break;
	}
}

function userChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	const response = addMessage(db, {
		toID: message.toID,
		fromID: user.id,
		message: message.chat
	});

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "user-chat",
			roomID: user.roomID,
			userID: user.id,
			chat: message.chat
		});
	}
}
