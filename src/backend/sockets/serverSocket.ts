import { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { userGameJoinReceived, userGameLeaveReceived, userSendGameChatReceived } from './gameMessages.js';
import { userInviteReceived, userLoginReceived, userReadyReceived, userSendUserChatReceived, userUnreadyReceived } from './userMessages.js';
import { getUser, markUserOffline } from '../db/userDB.js';
import { Message, MessageType, Result, User } from '../../common/interfaces.js';

export function serverSocket(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		socket?.on("message", (data: string | Buffer) => {
			const user = request.user;
			const message = JSON.parse(data as string);
			handleClientMessage(fastify, db, user, message)
		});

		socket?.on("close", () => {
			const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
			if (Result.SUCCESS != userResponse.result)
				return;

			const user = userResponse.contents;
			markUserOffline(db, user.userId);
			broadcastMessageToClients(fastify, {
				type: MessageType.USER_JOIN_GAME,
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
	fastify.websocketServer.clients.forEach((client: any) => {
		if (1 === client.readyState)
			client.send(JSON.stringify(message));
	});
}

/*
	Deals with a socket message from a client
*/
function handleClientMessage(fastify: FastifyInstance, db: DatabaseSync, user: User, message: Message) {
	switch (message.type) {
		case MessageType.USER_CONNECT:
			userLoginReceived(fastify, db, user, message);
			break;
		case MessageType.USER_JOIN_GAME:
			userGameJoinReceived(fastify, db, user, message);
			break;
		case MessageType.USER_INVITE:
			userInviteReceived(fastify, db, user, message);
			break;
		case MessageType.USER_LEAVE_GAME:
			userGameLeaveReceived(fastify, db, user, message);
			break;
		case MessageType.USER_SEND_GAME_CHAT:
			userSendGameChatReceived(fastify, db, user, message);
			break;
		case MessageType.USER_SEND_USER_CHAT:
			userSendUserChatReceived(fastify, db, user, message);
			break;
		case MessageType.USER_READY:
			userReadyReceived(fastify, db, user, message);
			break;
		case MessageType.USER_UNREADY:
			userUnreadyReceived(fastify, db, user, message);
			break;
	}
}
