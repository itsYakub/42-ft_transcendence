import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../db/userChatsDb.js';
import { broadcastMessageToClients } from './serverSockets.js';
import { markUserOnline } from '../db/userDB.js';
import { Result, User, WebsocketChatMessage, WebsocketGameMessage, WebsocketMessage, WebsocketMessageGroup, WebsocketMessageType } from '../../common/interfaces.js';
import { countReady, markReady, markUnReady } from '../db/gameDb.js';

export function handleIncomingUserMessage(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	switch (message.type) {
		case WebsocketMessageType.JOIN:
			useLoginReceived(fastify, db, user, message);
			break;
		case WebsocketMessageType.CHAT:
			userChatReceived(fastify, db, user, message as WebsocketChatMessage);
			break;
		case WebsocketMessageType.INVITE:
			userInviteReceived(fastify, db, user, message as WebsocketGameMessage);
			break;
		case WebsocketMessageType.READY:
			userReadyReceived(fastify, db, user, message as WebsocketGameMessage);
			break;
		case WebsocketMessageType.UNREADY:
			userUnreadyReceived(fastify, db, user, message as WebsocketGameMessage);
			break;
	}
}

function useLoginReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	console.log(`${user.nick} logged in`);

	message.fromId = user.userId;
	markUserOnline(db, user.userId);
	broadcastMessageToClients(fastify, message);
}

function userChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketChatMessage) {
	message.fromId = user.userId;
	const response = addUserChat(db, message);

	if (Result.SUCCESS == response.result)
		broadcastMessageToClients(fastify, message);
}

function userInviteReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketGameMessage) {
	message.gameId = user.gameId;
	broadcastMessageToClients(fastify, message);
}

function userReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketGameMessage) {
	const response = markReady(db, user.userId);

	if (Result.SUCCESS == response) {
		message.gameId = user.gameId;
		message.fromId = user.userId;
		broadcastMessageToClients(fastify, message);

		const readyResponse = countReady(db, user.gameId);
		if (Result.SUCCESS == readyResponse.result && readyResponse.contents) {
			message.group = WebsocketMessageGroup.GAME;
			broadcastMessageToClients(fastify, message);
		}
	}
}

function userUnreadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketGameMessage) {
	const response = markUnReady(db, user.userId);

	if (Result.SUCCESS == response) {
		message.gameId = user.gameId;
		message.fromId = user.userId;
		broadcastMessageToClients(fastify, message);
	}
}
