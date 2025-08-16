import { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { getUser, markUserOffline, markUserOnline } from './user/userDB.js';
import { leaveRoom } from './play/playDB.js';

export function socketRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		if (socket) {
			socket.on("message", (data: string | Buffer) => {
				const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
				const user = userResponse.user;
				const json = JSON.parse(data as string);
				switch (json.type) {
					case "joined": console.log(`${user.nick} joined`);
						markUserOnline(db, user);
						// socket.send(JSON.stringify({
						// 	type: "accepted",
						// 	user: user.nick
						// }));
						break;
					case "room-message":
						fastify.websocketServer.clients.forEach((client: any) => {
							if (client.readyState === 1) client.send(JSON.stringify({
								type: "room-message",
								roomID: user.roomID,
								userID: user.id,
								message: json.message
							}));
						});
						break;
					case "room-join":
						fastify.websocketServer.clients.forEach((client: any) => {
							if (client.readyState === 1) client.send(JSON.stringify({
								type: "room-join",
								roomID: user.roomID,
								userID: user.id,
							}));
						});
						break;
					case "room-ready":
						fastify.websocketServer.clients.forEach((client: any) => {
							if (client.readyState === 1) client.send(JSON.stringify({
								type: "room-ready",
								roomID: user.roomID,
								userID: user.id,
							}));
						});
						break;
				}
			});

			//setTimeout(connect,1000)

			socket.on("close", () => {
				const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
				const user = userResponse.user;
				console.log(`${userResponse.user.nick} disconnected`);
				markUserOffline(db, user);
				//if (user.roomID)
				//	leaveRoom(db, user);
				// too sensitive
			});
		}
	});
}
