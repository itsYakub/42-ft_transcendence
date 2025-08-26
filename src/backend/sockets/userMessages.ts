import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../db/userChatsDb.js';
import { broadcastMessageToClients } from './serverSocket.js';
import { markUserOnline } from '../db/userDB.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';
import { countReady, gamePlayers, markReady, markUnReady } from '../db/gameDb.js';
import { generateTournament } from './tournamentMessages.js';
import { gamersString } from '../views/lobbyView.js';
import { translate } from '../../common/translations.js';

export function userLoginReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	console.log(`${user.nick} logged in`);

	message.fromId = user.userId;
	markUserOnline(db, user.userId);
	broadcastMessageToClients(fastify, message);
}

export function userSendUserChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	message.fromId = user.userId;
	const response = addUserChat(db, message);

	if (Result.SUCCESS == response.result)
		broadcastMessageToClients(fastify, message);
}

export function userInviteReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	message.gameId = user.gameId;
	broadcastMessageToClients(fastify, message);
}

export function userReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const response = markReady(db, user.userId);

	if (Result.SUCCESS == response) {
		message.gameId = user.gameId;
		message.fromId = user.userId;

		const gamersBox = gamePlayers(db, user.gameId);
		if (Result.SUCCESS == gamersBox.result) {
			let text = gamersString(gamersBox.contents, user);
			message.content = text;
			broadcastMessageToClients(fastify, message);
		}


		const readyResponse = countReady(db, user.gameId);
		if (Result.SUCCESS == readyResponse.result && readyResponse.contents) {
			if (user.gameId.startsWith("m")) {
				message.type = MessageType.GAME_READY;
				broadcastMessageToClients(fastify, message);
			}
			else {
				generateTournament(fastify, db, user);
			}
		}
	}
}

export function userUnreadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const response = markUnReady(db, user.userId);

	if (Result.SUCCESS == response) {
		message.gameId = user.gameId;
		message.fromId = user.userId;
		broadcastMessageToClients(fastify, message);
	}
}
