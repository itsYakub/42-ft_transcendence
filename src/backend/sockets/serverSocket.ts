import { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { userGameLeaveReceived, tournamentChatReceived } from './gameMessages.js';
import { userInviteReceived, userLoginReceived, userSendUserChatReceived } from './userMessages.js';
import { getUser, markUserOffline } from '../db/userDB.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';
import { tournamentJoinReceived, tournamentGamerReadyReceived, tournamentMatchEndReceived, tournamentOverReceived, tournamentLeaveReceived } from './tournamentMessages.js';
import { matchJoinReceived, matchLeaveReceived, matchOverReceived, matchStartReceived } from './matchMessages.js';
import { notificationInviteReceived } from './notificationMessages.js';

const gamers = new Map<number, WebSocket>();

export function serverSocket(fastify: FastifyInstance): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		const db = request.db;
		const user = request.user;
		gamers.set(user.userId, socket);
	
		socket?.on("message", (data: string | Buffer) => {
			const message = JSON.parse(data as string);
			handleClientMessage(fastify, db, user, message)
		});

		socket?.on("close", () => {
			markUserOffline(db, user.userId);
			gamers.delete(user.userId);
			broadcastMessageToClients(fastify, {
				type: MessageType.MATCH_LEAVE,
				fromId: user.userId,
			});
			//if (user.gameID)
			//	leaveRoom(db, user);
			// too sensitive
		});
	});
}

/*
	Sends the message to all connected clients, who have to decide if it's relevant
*/
export function broadcastMessageToClients(fastify: FastifyInstance, message: Message) {
	gamers.forEach((v, k) => {
		if (1 === v.readyState)
			v.send(JSON.stringify(message));
	});
	// fastify.websocketServer.clients.forEach((client: WebSocket) => {
	// 	if (1 === client.readyState)
	// 		client.send(JSON.stringify(message));
	// });
}

/*
	Deals with a socket message from a client
*/
function handleClientMessage(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	switch (message.type) {
		case MessageType.USER_CONNECT:
			userLoginReceived(fastify, db, user, message);
			break;
		case MessageType.USER_INVITE:
			userInviteReceived(fastify, db, user, message);
			break;
		case MessageType.USER_LEAVE_GAME:
			userGameLeaveReceived(fastify, db, user, message);
			break;
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChatReceived(fastify, db, user, message);
			break;

		case MessageType.NOTIFICATION_INVITE:
			notificationInviteReceived(fastify, db, user, message);
			break;

		case MessageType.USER_READY:
			break;

		// Match messages
		// User has joined a new or existing match
		case MessageType.MATCH_JOIN:
			matchJoinReceived(fastify, db, user, message);
			break;
		// User has left a match lobby
		case MessageType.MATCH_LEAVE:
			matchLeaveReceived(fastify, db, user, message);
			break;
		// A match has finished
		case MessageType.MATCH_OVER:
			matchOverReceived(fastify, db, user, message);
			break;
		// The game is about to start
		case MessageType.MATCH_START:
			matchStartReceived(fastify, db, user, message);
			break;

		// Tournament messsages
		case MessageType.TOURNAMENT_CHAT:
			tournamentChatReceived(fastify, db, user, message);
			break;
		case MessageType.TOURNAMENT_JOIN:
			tournamentJoinReceived(fastify, db, user, message);
			break;
		case MessageType.TOURNAMENT_LEAVE:
			tournamentLeaveReceived(fastify, db, user, message);
			break;
		case MessageType.TOURNAMENT_GAMER_READY:
			tournamentGamerReadyReceived(fastify, db, user, message);
			break;
		case MessageType.TOURNAMENT_MATCH_END:
			tournamentMatchEndReceived(fastify, db, user, message);
			break;
		case MessageType.TOURNAMENT_OVER:
			tournamentOverReceived(fastify, db, user, message);
			break;
	}
}
