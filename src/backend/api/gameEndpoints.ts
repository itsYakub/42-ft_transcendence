import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { localMatchView } from '../views/localMatchView.js';

export function gameEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/api/game/local-match', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.send(localMatchView(request.user));
	});
}
