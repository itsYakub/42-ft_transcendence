import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { gamePlayers, updateGameId } from '../db/gameDb.js';
import { Box, Result } from '../../common/interfaces.js';
import { getTournament } from '../db/tournamentsDb.js';
import { remoteTournamentDetails } from '../views/remoteTournamentView.js';
import { addLocalTournament, updateLocalTournament } from '../db/localTournamentsDb.js';
import { addMatchResult } from '../db/matchResultsDb.js';
import { generateNickname, getNickname } from '../db/userDB.js';

export function tournamentEndpoints(fastify: FastifyInstance) {
	fastify.get('/api/tournament/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const gamersBox = gamePlayers(db, request.user.gameId);
		return reply.send(gamersBox);
	});
	
	fastify.get('/api/match/nicks', async (request: FastifyRequest, reply: FastifyReply) => {
		let nicks = [
			request.user.nick,
			generateNickname()
		];

		while (2 != nicks.filter((n, i) => nicks.indexOf(n) === i).length) {
			nicks = [
				request.user.nick,
				generateNickname()
			];
		}
		return {
			result: Result.SUCCESS,
			contents: nicks
		};
	});

	fastify.get('/api/tournament/nicks', async (request: FastifyRequest, reply: FastifyReply) => {
		let nicks = [
			request.user.nick,
			generateNickname(),
			generateNickname(),
			generateNickname()
		];

		while (4 != nicks.filter((n, i) => nicks.indexOf(n) === i).length) {
			nicks = [
				request.user.nick,
				generateNickname(),
				generateNickname(),
				generateNickname()
			];
		}
		return {
			result: Result.SUCCESS,
			contents: nicks
		};
	});

	fastify.get('/api/match/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const gamersBox = gamePlayers(db, request.user.gameId);
		return reply.send(gamersBox);
	});

	fastify.get('/api/tournament', async (request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> => {
		const db = request.db;
		const gamersBox = getTournament(db, request.user.gameId);
		if (Result.SUCCESS != gamersBox.result)
			return reply.send({
				result: gamersBox.result
			});

		return reply.send({
			result: Result.SUCCESS,
			contents: remoteTournamentDetails(gamersBox.contents, request.user)
		});
	});

	fastify.post('/api/tournament/add', async (request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> => {
		const db = request.db;
		const { gameId, gamers } = request.body as any;
		if (Result.SUCCESS == addLocalTournament(db, gamers, gameId))
			request.user.gameId = gameId;
		return reply.send(updateGameId(db, request.user));
	});

	fastify.post('/api/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const { g1Nick, g1Score, g2Nick, g2Score, matchNumber } = request.body as any;
		const user = request.user;
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
		if (g1Nick == user.nick) {
			const tournamentWin = 3 == matchNumber && g1Score > g2Score;
			const result = addMatchResult(db, user.userId, g2Nick, g1Score, g2Score, tournamentWin);
			if (Result.SUCCESS != result)
				return reply.send(result);
		}
		else if (g2Nick == user.nick) {
			const tournamentWin = 3 == matchNumber && g2Score > g1Score;
			const result = addMatchResult(db, user.userId, g1Nick, g2Score, g1Score, tournamentWin);
			if (Result.SUCCESS != result)
				return reply.send(result);
		}
		return reply.send(updateLocalTournament(db, user.gameId, match));
	});
}
