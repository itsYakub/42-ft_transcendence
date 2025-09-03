import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { addMatchResult } from '../db/matchResultsDb.js';

export function matchResultsEndpoints(fastify: FastifyInstance): void {
	fastify.post("/api/match-result/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const { g1Score, g2Nick, g2Score } = request.body as any;
		const user = request.user;

		return reply.send(addMatchResult(db, user.userId, g2Nick, g1Score, g2Score, false));
	});
}
