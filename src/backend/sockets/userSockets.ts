import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../db/userChatsDb.js';
import { broadcastMessageToClients } from './serverSockets.js';
import { markUserOnline } from '../db/userDB.js';
import { Result, User, WebsocketMessage, WebsocketMessageType } from '../../common/interfaces.js';

export function handleIncomingUserMessage(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	switch (message.type) {
		case WebsocketMessageType.JOIN:
			useLoginReceived(fastify, db, user, message);
			break;
		case WebsocketMessageType.CHAT:
			userChatReceived(fastify, db, user, message);
			break;
		case WebsocketMessageType.INVITE:
			userInviteReceived(fastify, db, user, message);
			break;
		// case WebsocketMessageType.JOIN:
		// 	userJoinReceived(fastify, db, user, message);
		// 	break;
		// case WebsocketMessageType.LEAVE:
		// 	userLeaveReceived(fastify, db, user, message);
		// 	break;
	}
}

function useLoginReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	console.log(`${user.nick} logged in`);

	message.fromId = user.userId;
	markUserOnline(db, user);
	broadcastMessageToClients(fastify, message);
}

function userChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	if (0 == message.toId)
		return;

	message.fromId = user.userId;
	const response = addUserChat(db, message);

	if (Result.SUCCESS == response.result)
		broadcastMessageToClients(fastify, message);
}

function userInviteReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	message.gameId = user.gameId;
	broadcastMessageToClients(fastify, message);
}

// function userJoinReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
// 	console.log(message);
// }

// function userLeaveReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
// 	console.log(message);
// }
