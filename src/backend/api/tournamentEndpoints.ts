import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { updateTournament } from '../old/tournamentDb.js';
import { gamePlayers } from '../db/gameDb.js';
import { Result } from '../../common/interfaces.js';
import { addTournament } from '../db/tournamentDb.js';

export function tournamentEndpoints(fastify: FastifyInstance, db: DatabaseSync) {
	fastify.get('/api/tournament/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const gamersBox = gamePlayers(db, request.user.gameId);
		return reply.send(gamersBox);
	});

	fastify.post('/api/tournament/add', async (request: FastifyRequest, reply: FastifyReply) => {
		const { gamers } = request.body as any;

		if (Result.SUCCESS == addTournament(db, request.user.gameId, gamers)) {
			gamers.forEach(gamer => {
				//send message
			});
		}
		return reply.send(Result.SUCCESS);
	});

	fastify.post('/api/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const params = request.body as any;
		params["user"] = request.user;

		const response = updateTournament(db, params);
		return reply.send(response);
	});
}
