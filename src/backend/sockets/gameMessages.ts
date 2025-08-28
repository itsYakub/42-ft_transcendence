import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { joinGame, leaveGame, } from '../db/gameDb.js';
import { Message, Result, User } from '../../common/interfaces.js';
import { addGameChat } from '../db/gameChatsDb.js';

export function userGameJoinReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const response = joinGame(db, message.gameId, user);

	message.fromId = user.userId;

	if (Result.SUCCESS == response) {
		broadcastMessageToClients(fastify, message);
	}
}

export function userGameLeaveReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	message.gameId = user.gameId;
	const response = leaveGame(db, user.userId);

	if (Result.SUCCESS == response) {
		message.fromId = user.userId;
		broadcastMessageToClients(fastify, message);
	}
}

export function userSendGameChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	message.fromId = user.userId;
	message.gameId = user.gameId;

	if (Result.SUCCESS == addGameChat(db, message))
		broadcastMessageToClients(fastify, message);
}
