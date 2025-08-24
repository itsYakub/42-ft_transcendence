import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addMatchResult, matchResultsList } from '../db/matchResultsDb.js';

export function matchResultsEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	// fastify.post("/api/match-results/add", async (request: FastifyRequest, reply: FastifyReply) => {
	// 	const params = request.body as any;
	// 	params["userId"] = request.user.userId;

	// 	const response = addHistory(db, params);
	// 	return reply.send(response);
	// });
}
