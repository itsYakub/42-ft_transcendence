import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addFoe, removeFoe } from '../db/foesDb.js';

export function foesEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/foes/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const { foeId } = request.body as any;
		return reply.send(addFoe(db, user.userId, foeId));
	});

	fastify.post("/foes/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const { foeId } = request.body as any;
		return reply.send(removeFoe(db, user.userId, foeId));
	});
}
