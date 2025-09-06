import { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { userGameLeaveReceived, tournamentChatReceived } from './gameMessages.js';
import { userInviteReceived, userLoginReceived, userSendUserChatReceived } from './userMessages.js';
import { getUser, getUserById, markUserOffline, usersByGameId } from '../db/userDB.js';
import { Message, MessageType, Result, ShortUser, User } from '../../common/interfaces.js';
import { tournamentJoinReceived, tournamentGamerReadyReceived, tournamentMatchEndReceived, tournamentOverReceived, tournamentLeaveReceived } from './tournamentMessages.js';
import { matchJoinReceived, matchLeaveReceived, matchOverReceived, matchStartReceived } from './matchMessages.js';
import { notificationInviteReceived } from './notificationMessages.js';

const gamers = new Map<number, WebSocket>();
let db: DatabaseSync;

export function serverSocket(fastify: FastifyInstance): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		db = request.db;
		const userBox = getUserById(db, request.user?.userId);
		if (Result.SUCCESS != userBox.result)
			return;

		const user = userBox.contents;
		gamers.set(user.userId, socket);
	
		socket?.on("message", (data: string | Buffer) => {
			const message = JSON.parse(data as string);
			handleClientMessage(db, user, message)
		});

		socket?.on("close", () => {
			markUserOffline(db, user.userId);
			gamers.delete(user.userId);
			sendMessageToUsers({
				type: MessageType.MATCH_LEAVE,
				fromId: user.userId,
			});
		});
	});
}

/*
	Sends the message to all connected users
*/
export function sendMessageToUsers(message: Message) {
	gamers.forEach((socket, userId) => sendMessage(socket, message));
}

/*
	Sends the message to all users in the same match/lobby
*/
export function sendMessageToGameIdUsers(message: Message, gameId: string) {
	if (!db)
		return;

	const users = usersByGameId(db, gameId);
	if (Result.SUCCESS == users.result) {
		gamers.forEach((socket, userId) => sendMessage(socket, message));
	}
}

/*
	Sends the message to all clients in the same match/lobby except the originator
*/
export function sendMessageToOtherGameIdUsers(message: Message, gameId: string) {
	if (!db)
		return;
	
	const users = usersByGameId(db, gameId);
	if (Result.SUCCESS == users.result) {
		gamers.forEach((socket, userId) => {
			if (userId != message.fromId)
				sendMessage(socket, message);
		});
	}
}

/*
	Sends the message to a specific user
*/
export function sendMessageToUser(message: Message, userId: number) {
	if (gamers.has(userId))
		sendMessage(gamers[userId], message);
}

function sendMessage(socket: WebSocket, message: Message) {
	if (1 === socket.readyState)
		socket.send(JSON.stringify(message));
}

/*
	Deals with a socket message from a client
*/
function handleClientMessage(db: DatabaseSync, user: ShortUser, message: Message) {
	switch (message.type) {
		case MessageType.USER_CONNECT:
			userLoginReceived(db, user);
			break;
		case MessageType.USER_INVITE:
			userInviteReceived(db, user, message);
			break;
		case MessageType.USER_LEAVE_GAME:
			userGameLeaveReceived(db, user, message);
			break;
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChatReceived(db, user, message);
			break;

		case MessageType.NOTIFICATION_INVITE:
			notificationInviteReceived(db, user, message);
			break;

		case MessageType.USER_READY:
			break;

		// Match messages
		// User has joined a new or existing match
		case MessageType.MATCH_JOIN:
			matchJoinReceived(db, user, message);
			break;
		// User has left a match lobby
		case MessageType.MATCH_LEAVE:
			matchLeaveReceived(db, user, message);
			break;
		// A match has finished
		case MessageType.MATCH_OVER:
			matchOverReceived(db, user, message);
			break;
		// The game is about to start
		case MessageType.MATCH_START:
			matchStartReceived(db, user, message);
			break;

		// Tournament messsages
		case MessageType.TOURNAMENT_CHAT:
			tournamentChatReceived(db, user, message);
			break;
		case MessageType.TOURNAMENT_JOIN:
			tournamentJoinReceived(db, user, message);
			break;
		case MessageType.TOURNAMENT_LEAVE:
			tournamentLeaveReceived(db, user, message);
			break;
		case MessageType.TOURNAMENT_GAMER_READY:
			tournamentGamerReadyReceived(db, user, message);
			break;
		case MessageType.TOURNAMENT_MATCH_END:
			tournamentMatchEndReceived(db, user, message);
			break;
		case MessageType.TOURNAMENT_OVER:
			tournamentOverReceived(db, user, message);
			break;
	}
}
