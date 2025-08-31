import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addMatchResult } from '../db/matchResultsDb.js';
import { Result } from '../../common/interfaces.js';

export function matchResultsEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/api/match-result/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const { } = request.body as any;

		const { g1Score, g2Nick, g2Score } = request.body as any;
		const user = request.user;
		const result = addMatchResult(db, user.userId, g2Nick, g1Score, g2Score, false);
		if (Result.SUCCESS != result)
			return reply.send(result);

		return reply.send(Result.SUCCESS);
	});
}
