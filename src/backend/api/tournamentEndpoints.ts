import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { gamePlayers, updateGameId } from '../db/gameDb.js';
import { Box, Result } from '../../common/interfaces.js';
import { getTournament } from '../db/tournamentsDb.js';
import { tournamentDetails } from '../views/tournamentView.js';
import { addLocalTournament, updateLocalTournament } from '../db/localTournamentsDb.js';

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
		request.user.gameId = gameId;
		if (Result.SUCCESS == addLocalTournament(db, gamers, request.user))
			return reply.send(updateGameId(db, request.user));
	});

	fastify.post('/api/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const { g1Nick, g1Score, g2Nick, g2Score, matchNumber } = request.body as any;
		const match = {
			g1: {
				nick: g1Nick,
				score: g1Score
			},
			g2: {
				nick: g2Nick,
				score: g2Score
			},
			matchNumber
		};
		return reply.send(updateLocalTournament(db, request.user.gameId, match));
	});
}
