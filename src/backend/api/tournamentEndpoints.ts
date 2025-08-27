import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { updateTournament } from '../old/tournamentDb.js';
import { gamePlayers } from '../db/gameDb.js';
import { Box, Result } from '../../common/interfaces.js';
import { getTournament } from '../db/tournamentDb.js';
import { activeMatchHtml } from '../views/tournamentView.js';

export function tournamentEndpoints(fastify: FastifyInstance, db: DatabaseSync) {
	fastify.get('/api/tournament/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const gamersBox = gamePlayers(db, request.user.gameId);
		return reply.send(gamersBox);
	});

	fastify.get('/api/tournament', async (request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> => {
		const gamersBox = getTournament(db, request.user);
		if (Result.SUCCESS != gamersBox.result)
			return reply.send({
				result: gamersBox.result
			});

		return reply.send({
			result: Result.SUCCESS,
			contents: activeMatchHtml(gamersBox.contents, request.user)
		});
	});

	fastify.post('/api/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const params = request.body as any;
		params["user"] = request.user;

		const response = updateTournament(db, params);
		return reply.send(response);
	});
}
