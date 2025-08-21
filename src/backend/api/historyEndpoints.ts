import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addHistory } from '../db/historyDB.js';

export function historyEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {

	fastify.post("/history/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const params = request.body as any;
		params["id"] = request.user.userId;

		const response = addHistory(db, params);
		return reply.send(response);
	});
}
