import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { Result } from '../../common/interfaces.js';

export function userEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {

	fastify.post("/user/join", async (request: FastifyRequest, reply: FastifyReply) => {
	});

	fastify.post("/user/leave", async (request: FastifyRequest, reply: FastifyReply) => {
		
	});

	fastify.get("/user/id", async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.user)
			return reply.send({
				result: Result.ERR_NO_USER
			});

		return reply.send({
			result: Result.SUCCESS,
			user: {
				userId: request.user.userId,
				nick: request.user.nick,
				online: request.user.online,
				gameId: request.user.gameId
			}
		});
	});
}
