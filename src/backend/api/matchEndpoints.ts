import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { updateTournament } from '../old/tournamentDb.js';
import { gamePlayers } from '../db/gameDb.js';
import { Box, Gamer, MatchGamer, Result } from '../../common/interfaces.js';
import { getMatch } from '../db/matchesDb.js';
import { gamersHtml } from '../views/matchLobbyView.js';

function tournamentEndpoints(fastify: FastifyInstance, db: DatabaseSync) {
	

	// fastify.get('/api/match', async (request: FastifyRequest, reply: FastifyReply): Promise<Box<string>> => {
	// 	// const gamersBox = getMatch(db, request.user.gameId);
	// 	// if (Result.SUCCESS != gamersBox.result)
	// 	// 	return reply.send({
	// 	// 		result: gamersBox.result
	// 	// 	});

	// 	// return reply.send({
	// 	// 	result: Result.SUCCESS,
	// 	// 	contents: gamersString(gamersBox.contents.g1, gamersBox.contents.g2, request.user)
	// 	// });
	// });

	fastify.post('/api/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const params = request.body as any;
		params["user"] = request.user;

		const response = updateTournament(db, params);
		return reply.send(response);
	});
}
