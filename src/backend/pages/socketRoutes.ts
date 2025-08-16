import { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { getUser, markUserOffline, markUserOnline } from './user/userDB.js';
import { leaveRoom } from './play/playDB.js';

export function socketRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (socket && 200 == userResponse.code) {
			const user = userResponse.user;
			socket.on("message", (data: string | Buffer) => {
				const json = JSON.parse(data as string);
				switch (json.type) {
					case "joined": console.log(`${user.nick} joined`);
						markUserOnline(db, user);
						socket.send(JSON.stringify({
							type: "accepted",
							user: user.nick
						}));
						break;
				}
			});

			socket.on("close", () => {
				console.log(`${userResponse.user.nick} disconnected`);
				markUserOffline(db, user);
				if (user.roomID)
					leaveRoom(db, user);
			});
		}
	});
}
