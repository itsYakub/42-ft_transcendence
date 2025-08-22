import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSockets.js';
import { countReady, joinGame, leaveGame, markPlaying, markReady } from '../db/gameDb.js';
import { Result, User, WebsocketMessage, WebsocketMessageGroup, WebsocketMessageType } from '../../common/interfaces.js';
import { addGameChat } from '../db/gameChatsDb.js';

export function handleIncomingGameMessage(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	switch (message.type) {
		case WebsocketMessageType.JOIN:
			gameJoinReceived(fastify, db, user, message);
			break;
		case WebsocketMessageType.LEAVE:
			gameLeaveReceived(fastify, db, user, message);
			break;
		//case WebsocketMessageType.READY:
		//	gamePlayerReadyReceived(fastify, db, user, message);
		//	break;
		case WebsocketMessageType.CHAT:
			gameChatReceived(fastify, db, user, message);
			break;
	}
}

function gameJoinReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	const response = joinGame(db, message.gameId, user);
	console.log(response);

	message.fromId = user.userId;

	if (Result.SUCCESS == response.result) {
		broadcastMessageToClients(fastify, message);
	}
}

function gameLeaveReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	message.gameId = user.gameId;
	const response = leaveGame(db, user.userId);

	console.log(`user id ${user.userId} has left the game`);

	if (Result.SUCCESS == response.result) {
		message.fromId = user.userId;
		broadcastMessageToClients(fastify, message);
	}
}

function gameChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	message.fromId = user.userId;
	message.gameId = user.gameId;
	const response = addGameChat(db, message);

	if (Result.SUCCESS == response.result)
		broadcastMessageToClients(fastify, message);
}
