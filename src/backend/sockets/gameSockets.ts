import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSockets.js';
import { addGameMessage, addToGame, countReady, leaveGame, markPlaying, markReady } from '../db/gameDB.js';

export function handleGameMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	switch (message.type) {
		case "game-join":
			gameJoinReceived(fastify, db, user, message);
			break;
		case "game-leave":
			gameLeaveReceived(fastify, db, user);
			break;
		case "game-gamer-ready":
			gamePlayerReadyReceived(fastify, db, user);
			break;
		case "game-chat":
			gameChatReceived(fastify, db, user, message);
			break;
	}
}

function gameJoinReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	const response = addToGame(db, {
		gameID: message.gameID,
		user
	});

	user["gameID"] = message.gameID;

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "game-join",
			gameID: user.gameID,
			userID: user.id,
		});
	}
}

function gameLeaveReceived(fastify: FastifyInstance, db: DatabaseSync, user: any) {
	const response = leaveGame(db, {
		id: user.id,
		gameID: user.gameID
	});

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "game-leave",
			gameID: user.gameID,
			userID: user.id,
		});
	}
}

function gamePlayerReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: any) {
	const response = markReady(db, user);

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "game-gamer-ready",
			gameID: user.gameID,
			userID: user.id,
		});
	}

	const readyResponse = countReady(db, user);
	if (200 == readyResponse.code && readyResponse.ready) {
		markPlaying(db, user);
		broadcastMessageToClients(fastify, {
			type: "game-ready",
			gameID: user.gameID,
			userID: user.id,
		});
	}
}

function gameChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	const response = addGameMessage(db, {
		toID: user.gameID,
		fromID: user.id,
		message: message.chat
	});

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "game-chat",
			gameID: user.gameID,
			userID: user.id,
			chat: message.chat
		});
	}
}
