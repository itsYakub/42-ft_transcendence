import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';
import { addGameChat } from '../db/gameChatsDb.js';
import { removeUserFromMatch } from '../db/userDB.js';

export function userGameLeaveReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	message.gameId = user.gameId;
	const response = removeUserFromMatch(db, user.userId);

	if (Result.SUCCESS == response) {
		message.fromId = user.userId;
		broadcastMessageToClients(fastify, message);
	}
}

export function tournamentChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	message.fromId = user.userId;
	message.gameId = user.gameId;

	if (Result.SUCCESS == addGameChat(db, message))
		broadcastMessageToClients(fastify, message);
}
