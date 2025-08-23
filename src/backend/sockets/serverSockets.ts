import { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { handleIncomingGameMessage } from './gameSockets.js';
import { handleIncomingUserMessage } from './userSockets.js';
import { handleIncomingErrorMessage } from './errorsSockets.js';
import { getUser, markUserOffline } from '../db/userDB.js';
import { Result, User, WebsocketMessage, WebsocketMessageGroup, WebsocketMessageType } from '../../common/interfaces.js';

export function serverSockets(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		//if (socket) {
		socket?.on("message", (data: string | Buffer) => {
			//	const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
			//if (Result.SUCCESS != userResponse.result)
			//	return;

			const user = request.user;
			const message = JSON.parse(data as string);
			handleMessage(fastify, db, user, message)
		});

		socket?.on("close", () => {
			const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
			if (Result.SUCCESS != userResponse.result)
				return;

			const user = userResponse.user;
			markUserOffline(db, user.userId);
			broadcastMessageToClients(fastify, {
				group: WebsocketMessageGroup.USER,
				type: WebsocketMessageType.JOIN,
				fromId: user.userId,
			});
			//if (user.gameID)
			//	leaveRoom(db, user);
			// too sensitive
		});
		//}
	});
}

/*
	Sends the message to all connected clients, who have to decide if it's relevant
*/
export function broadcastMessageToClients(fastify: FastifyInstance, message: WebsocketMessage) {
	fastify.websocketServer.clients.forEach((client: any) => {
		if (1 === client.readyState)
			client.send(JSON.stringify(message));
	});
}

function handleMessage(fastify: FastifyInstance, db: DatabaseSync, user: User, message: WebsocketMessage) {
	if (WebsocketMessageGroup.ERROR == message.group)
		handleIncomingErrorMessage(fastify, db, user, message);

	if (WebsocketMessageGroup.GAME == message.group)
		handleIncomingGameMessage(fastify, db, user, message);

	if (WebsocketMessageGroup.USER == message.group)
		handleIncomingUserMessage(fastify, db, user, message);
}
