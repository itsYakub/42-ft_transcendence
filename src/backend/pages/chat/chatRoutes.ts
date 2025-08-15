import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import type { WebSocket } from "@fastify/websocket";
import { DatabaseSync } from "node:sqlite";
import { addMessage } from './chatDB.js';
import { getUser } from '../user/userDB.js';

export function chatRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/add-message", async (request: FastifyRequest, reply: FastifyReply) => {
		const json = JSON.parse(request.body as string);
		const response = addMessage(db, json);
		if ("error" in response) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});

	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => {
		const userId = 'Anonymous';
		//const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		//console.log(userResponse);
		socket!.on("open", () => {
			console.log(`WebSocket opened for user:: ${userId}`);
		});

		socket!.on("message", (data: string | Buffer) => {
			
		});

		socket!.on("close", () => {
			console.log(`WebSocket disconnected: ${userId}`);
		});
	});
}
