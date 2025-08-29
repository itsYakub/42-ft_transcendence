import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUserChat } from '../db/userChatsDb.js';
import { broadcastMessageToClients } from './serverSocket.js';
import { markUserOnline } from '../db/userDB.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';
import { gamePlayers, joinLobby } from '../db/gameDb.js';
import { generateTournament } from './tournamentMessages.js';
import { gamersString } from '../views/matchLobbyView.js';
import { translate } from '../../common/translations.js';
import { joinMatch, getMatch, markMatchGamerReady } from '../db/matchesDb.js';

export function matchJoinReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	console.log("joinging match");
	if (Result.SUCCESS == joinLobby(db, message.gameId, user)) {
		if (Result.SUCCESS == joinMatch(db, user)) {
			const matchBox = getMatch(db, message.gameId);
			if (Result.SUCCESS == matchBox.result) {
				broadcastMessageToClients(fastify, {
					type: MessageType.MATCH_UPDATE,
					content: gamersString(matchBox.contents.g1, matchBox.contents.g2, user)
				});
			}
		}
	}
}

export function matchGamerReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	console.log("got message");

	if (Result.SUCCESS == markMatchGamerReady(db, user)) {
		const match = getMatch(db, user.gameId);
		broadcastMessageToClients(fastify, {
			type: MessageType.MATCH_UPDATE,
			gameId: user.gameId,
			content: gamersString(match.contents.g1, match.contents.g2, user)
		});

		// if (userOpponent(match, user).ready) {
		// 	console.log(`starting match between ${match.g1.nick} and ${match.g2.nick}`);
		// 	broadcastMessageToClients(fastify, {
		// 		type: MessageType.TOURNAMENT_MATCH_START,
		// 		match
		// 	});
		// }
	}


	// const response = markReady(db, user.userId);

	// if (Result.SUCCESS == response) {
	// 	message.gameId = user.gameId;
	// 	message.fromId = user.userId;

	// 	const gamersBox = gamePlayers(db, user.gameId);
	// 	if (Result.SUCCESS == gamersBox.result) {
	// 		let text = gamersString(gamersBox.contents, user);
	// 		message.content = text;
	// 		broadcastMessageToClients(fastify, message);
	// 	}


	// 	const readyResponse = countReady(db, user.gameId);
	// 	if (Result.SUCCESS == readyResponse.result && readyResponse.contents) {
	// 		if (user.gameId.startsWith("m")) {
	// 			message.type = MessageType.GAME_READY;
	// 			broadcastMessageToClients(fastify, message);
	// 		}
	// 		else {
	// 			generateTournament(fastify, db, user);
	// 		}
	// 	}
	// }
}
