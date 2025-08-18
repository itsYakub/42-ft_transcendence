import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addMessage } from './chatDB.js';

export function chatRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/add-message", async (request: FastifyRequest, reply: FastifyReply) => {
		const json = JSON.parse(request.body as string);
		const response = addMessage(db, json);
		if ("error" in response) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});
}
