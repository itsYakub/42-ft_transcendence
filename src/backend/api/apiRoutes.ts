import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { allNicknames } from '../pages/user/userDB.js';

export function apiRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/api/nicknames', async (request: FastifyRequest, reply: FastifyReply) => {
		const users = allNicknames(db);
		return reply.send(users);
	});
}
