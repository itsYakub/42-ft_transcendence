import { FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { tournamentChatReceived } from './gameMessages.js';
import { userInviteReceived, userSendUserChatReceived } from './userMessages.js';
import { getUser, usersByGameId } from '../../db/userDB.js';
import { Message, MessageType, Result, ShortUser } from '../../common/interfaces.js';
import { tournamentJoinReceived, tournamentGamerReadyReceived, tournamentMatchEndReceived, tournamentOverReceived, tournamentLeaveReceived } from './tournamentMessages.js';
import { matchJoinReceived, matchLeaveReceived, matchOverReceived, matchStartReceived, matchUpdateReceived } from './matchMessages.js';
import { notificationInviteReceived } from './notificationMessages.js';

export const onlineUsers = new Map<number, WebSocket>();

let db: DatabaseSync;

export function connectToServerSocket(socket: WebSocket, request: FastifyRequest) {
	db = request.db;

	const user = request.user;
	onlineUsers.set(request.user.userId, socket);
	console.log(`connected user is now ${user.nick}`);
	console.log(`connected clients: ${onlineUsers.size}`);

	socket?.on("message", (data: string) => {
		const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (Result.SUCCESS != userBox.result)
			return;

		const message = JSON.parse(data as string);
		onlineUsers.set(userBox.contents.userId, socket);
		handleClientMessage(db, userBox.contents, message);
	});

	socket?.on("close", () => {
		const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (Result.SUCCESS != userBox.result)
			return;

		console.log(`${userBox.contents.nick} closed socket`);
		onlineUsers.delete(userBox.contents.userId);
		matchLeaveReceived(db, userBox.contents);
	});
}

/*
	Sends the message to all connected users
*/
export function sendMessageToUsers(message: Message) {
	onlineUsers.forEach((socket, userId) => sendMessage(socket, message));
}

/*
	Sends the message to all users in the same match/lobby
*/
export function sendMessageToGameIdUsers(message: Message, gameId: string) {
	if (!db)
		return;

	const users = usersByGameId(db, gameId);
	if (Result.SUCCESS == users.result) {
		onlineUsers.forEach((socket, userId) => sendMessage(socket, message));
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
		onlineUsers.forEach((socket, userId) => {
			if (userId != message.fromId)
				sendMessage(socket, message);
		});
	}
}

/*
	Sends the message to a specific user
*/
export function sendMessageToUser(message: Message, userId: number) {
	if (onlineUsers.has(userId))
		sendMessage(onlineUsers[userId], message);
}

function sendMessage(socket: WebSocket, message: Message) {
	if (1 === socket.readyState)
		socket.send(JSON.stringify(message));
}

/*
	Deals with a socket message from a client
*/
export function handleClientMessage(db: DatabaseSync, user: ShortUser, message: Message) {
	switch (message.type) {
		case MessageType.USER_INVITE:
			userInviteReceived(db, user, message);
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
		case MessageType.MATCH_JOIN:
			matchJoinReceived(db, user, message);
			break;
		case MessageType.MATCH_LEAVE:
			matchLeaveReceived(db, user);
			break;
		case MessageType.MATCH_OVER:
			matchOverReceived(db, user, message);
			break;
		case MessageType.MATCH_START:
			matchStartReceived(db, user, message);
			break;
		case MessageType.MATCH_UPDATE:
		case MessageType.MATCH_GOAL:
		case MessageType.MATCH_RESET:
		case MessageType.MATCH_END:
			matchUpdateReceived(db, user, message);
			break;

		// Tournament messages
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
