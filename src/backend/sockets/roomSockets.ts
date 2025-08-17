import { FastifyInstance } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { broadcastMessageToClients } from './serverSockets.js';
import { addToRoom, countReady, leaveRoom, markPlaying, markReady } from '../pages/play/playDB.js';
import { addMessage } from '../pages/messages/messagesDB.js';

export function handleServerRoomMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	switch (message.type) {
		case "room-join":
			roomJoinReceived(fastify, db, user, message);
			break;
		case "room-leave":
			roomLeaveReceived(fastify, db, user);
			break;
		case "room-player-ready":
			roomPlayerReadyReceived(fastify, db, user);
			break;
		case "room-chat":
			roomChatReceived(fastify, db, user, message);
			break;
	}
}

function roomJoinReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	const response = addToRoom(db, {
		roomID: message.roomID,
		user
	});

	user["roomID"] = message.roomID;

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "room-join",
			roomID: user.roomID,
			userID: user.id,
		});
	}
}

function roomLeaveReceived(fastify: FastifyInstance, db: DatabaseSync, user: any) {
	const response = leaveRoom(db, {
		id: user.id,
		roomID: user.roomID
	});

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "room-leave",
			roomID: user.roomID,
			userID: user.id,
		});
	}
}

function roomPlayerReadyReceived(fastify: FastifyInstance, db: DatabaseSync, user: any) {
	const response = markReady(db, user);

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "room-player-ready",
			roomID: user.roomID,
			userID: user.id,
		});
	}

	const readyResponse = countReady(db, user);
	if (200 == readyResponse.code && readyResponse.ready) {
		markPlaying(db, user);
		broadcastMessageToClients(fastify, {
			type: "room-ready",
			roomID: user.roomID,
			userID: user.id,
		});
	}
}

function roomChatReceived(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	const response = addMessage(db, {
		toID: user.roomID,
		fromID: user.id,
		message: message.chat
	});

	if (200 == response.code) {
		broadcastMessageToClients(fastify, {
			type: "room-chat",
			roomID: user.roomID,
			userID: user.id,
			chat: message.chat
		});
	}
}
