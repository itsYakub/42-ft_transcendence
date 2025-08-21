import { addFoe, removeFoe } from 'backend/db/foesDB';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";

export function foesEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/foes/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const json = request.body as any;
		json["id"] = user.userId;

		const response = addFoe(db, json);
		return reply.send(response);
	});

	fastify.post("/foes/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const json = request.body as any;
		json["id"] = user.userId;

		const response = removeFoe(db, json);
		return reply.send(response);
	});
}
