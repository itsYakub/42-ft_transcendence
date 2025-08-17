import { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { getUser, markUserOffline } from '../pages/user/userDB.js';
import { handleServerRoomMessage } from './roomSockets.js';
import { handleServerUserMessage } from './userSockets.js';

export function serverSockets(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		if (socket) {
			socket.on("message", (data: string | Buffer) => {
				const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
				if (200 != userResponse.code)
					return;

				const user = userResponse.user;
				const message = JSON.parse(data as string);
				handleMessage(fastify, db, user, message)
			});

			socket.on("close", () => {
				const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
				if (200 != userResponse.code)
					return;

				const user = userResponse.user;
				markUserOffline(db, user);
				//if (user.roomID)
				//	leaveRoom(db, user);
				// too sensitive
			});
		}
	});
}

/*
	Sends the message to all connected clients, who have to decide if it's relevant
*/
export function broadcastMessageToClients(fastify: FastifyInstance, message: any) {
	fastify.websocketServer.clients.forEach((client: any) => {
		if (1 === client.readyState)
			client.send(JSON.stringify(message));
	});
}


function handleMessage(fastify: FastifyInstance, db: DatabaseSync, user: any, message: any) {
	if (message.type.startsWith("room-"))
		handleServerRoomMessage(fastify, db, user, message);
	if (message.type.startsWith("user-"))
		handleServerUserMessage(fastify, db, user, message);
}
