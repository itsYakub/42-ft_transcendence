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
		socket.on("open", () => {
			//mark online

			console.log(`📡 WebSocket opened for user:: ${userId}`);
		});

		socket.on("message", (data: string | Buffer) => {
			let msg;
			try {
				msg = JSON.parse(typeof data === "string" ? data : data.toString());
				console.log(`📨 Received message from ${userId}:`, msg);
			} catch {
				console.warn("⚠️ Invalid message format:", data);
				return;
			}

			switch (msg.type) {
				case "chat": {
					console.log(`💬 Storing message in DB from ${userId} to ${msg.to}: "${msg.text}"`);
					addMessage(db, {
						sender: userId,
						recipient: msg.to,
						message: msg.text,
					});
					const chatPayload = JSON.stringify({
						type: "chat",
						from: userId,
						to: msg.to,
						text: msg.text,
					});
					console.log("📤 Broadcasting chat to all clients");
					fastify.websocketServer.clients.forEach((client: any) => {
						if (client.readyState === 1) client.send(chatPayload);
					});
					break;
				}
				case "invite": {
					console.log(`🎮 ${userId} is sending a game invite`);
					const invitePayload = JSON.stringify({ type: "invite", from: userId });
					fastify.websocketServer.clients.forEach((client: any) => {
						if (client.readyState === 1) client.send(invitePayload);
					});
					break;
				}
				default:
					console.warn("❓ Unknown message type:", msg.type);
			}
		});

		socket.on("close", () => {
			// mark offline
			// leave room
			console.log(`❌ WebSocket disconnected: ${userId}`);
		});
	});
}
