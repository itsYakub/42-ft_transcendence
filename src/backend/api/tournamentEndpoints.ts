import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { updateTournament } from '../old/tournamentDb.js';
import { gamePlayers, updateGameId } from '../db/gameDb.js';
import { Box, Result } from '../../common/interfaces.js';
import { addLocalTournament, getTournament } from '../db/tournamentsDb.js';
import { tournamentDetails } from '../views/tournamentView.js';
import { addUserToMatch } from '../db/userDB.js';

export function tournamentEndpoints(fastify: FastifyInstance, db: DatabaseSync) {
	fastify.get('/api/tournament/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const gamersBox = gamePlayers(db, request.user.gameId);
		return reply.send(gamersBox);
	});

	fastify.get('/api/match/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const gamersBox = gamePlayers(db, request.user.gameId);
		return reply.send(gamersBox);
	});

	fastify.get('/api/tournament', async (request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> => {
		const gamersBox = getTournament(db, request.user.gameId);
		if (Result.SUCCESS != gamersBox.result)
			return reply.send({
				result: gamersBox.result
			});

		return reply.send({
			result: Result.SUCCESS,
			contents: tournamentDetails(gamersBox.contents, request.user)
		});
	});

	fastify.post('/api/tournament/add', async (request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> => {
		const { gameId, gamers } = request.body as any;
		if (Result.SUCCESS == addLocalTournament(db, gameId, gamers)) {
			request.user.gameId = gameId;
			return reply.send(updateGameId(db, request.user));
		}
	});

	fastify.post('/api/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const params = request.body as any;
		params["user"] = request.user;

		const response = updateTournament(db, params);
		return reply.send(response);
	});
}
