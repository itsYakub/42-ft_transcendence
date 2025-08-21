import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addTournament, updateTournament } from '../db/tournamentDB.js';

export function tournamentEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post('/tournament/add', async (request: FastifyRequest, reply: FastifyReply) => {
		const response = addTournament(db, request.body as any);
		return reply.send(response);
	});

	fastify.post('/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const params = request.body as any;
		params["user"] = request.user;

		const response = updateTournament(db, params);
		return reply.send(response);
	});
}
