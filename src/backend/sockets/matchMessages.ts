import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSocket.js';
import { addUserToMatch, removeUserFromMatch, removeUsersFromMatch, usersInMatch } from '../db/userDB.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';
import { gamersHtml } from '../views/remoteMatchLobbyView.js';

export function matchJoinReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const gameId = message.gameId;
	if (Result.SUCCESS == addUserToMatch(db, gameId, user)) {
		const gamers = usersInMatch(db, gameId);
		if (Result.SUCCESS == gamers.result) {
			if (2 == gamers.contents.length) {
				broadcastMessageToClients(fastify, {
					type: MessageType.MATCH_READY,
					gameId
				});
			}

			broadcastMessageToClients(
				fastify, {
				type: MessageType.MATCH_LOBBY,
				gameId,
				content: gamersHtml(gamers.contents)
			});
		}
	}
}

export function matchLeaveReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const gameId = user.gameId;
	const response = removeUserFromMatch(db, user.userId);

	if (Result.SUCCESS == response && gameId) {
		const gamers = usersInMatch(db, gameId);
		console.log(gamers);
		if (Result.SUCCESS == gamers.result) {
			broadcastMessageToClients(
				fastify, {
				type: MessageType.MATCH_LOBBY,
				gameId,
				content: gamersHtml(gamers.contents)
			});
		}
	}
}

export function matchOverReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	const response = removeUsersFromMatch(db, message.gameId);
	// add match-result here, only once per match!
		broadcastMessageToClients(
			fastify, {
			type: MessageType.MATCH_OVER,
			gameId: message.gameId
	});
}

export function matchStartReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	broadcastMessageToClients(
		fastify, {
		type: MessageType.MATCH_START,
		gameId: message.gameId
	});
}
