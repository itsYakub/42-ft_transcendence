import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../db/userChatsDb.js';
import { broadcastMessageToClients } from './serverSocket.js';
import { markUserOnline } from '../db/userDB.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';
import { gamePlayers } from '../db/gameDb.js';
import { generateTournament } from './tournamentMessages.js';
import { gamersHtml } from '../views/matchLobbyView.js';
import { translate } from '../../common/translations.js';
import { getMatch, markMatchGamerReady } from '../db/matchesDb.js';

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



// export function userUnreadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
// 	const response = markUnReady(db, user.userId);

// 	if (Result.SUCCESS == response) {
// 		message.gameId = user.gameId;
// 		message.fromId = user.userId;
// 		broadcastMessageToClients(fastify, message);
// 	}
// }
