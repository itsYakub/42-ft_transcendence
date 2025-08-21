import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { getGames, gamePlayers, gameMessages } from '../db/gameDB.js';
import { matchHtml } from '../views/matchHtml.js';
import { gameView } from '../views/gameView.js';

export function gameRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/game', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		// user is already in a game
		if (user.gameId) {
			const gameID = user.gameId;

			const gamersResponse = gamePlayers(db, { gameID });
			const messagesResponse = gameMessages(db, { gameID });

			const params = {
				gamers: gamersResponse.gamers,
				user,
				page: request.url,
				messages: messagesResponse.messages,
				language: request.language
			};

			const frame = frameView(params, matchHtml(params));
			return reply.type("text/html").send(frame);
		}

		const gamesResponse = getGames(db);
		if (200 != gamesResponse.code) {
			const params = {
				language,
				user: user,
				page: request.url,
				errorCode: gamesResponse.code,
				errorMessage: gamesResponse.error
			};
			return reply.type("text/html").send(frameView(params));
		}

		const params = {
			user: user,
			page: request.url,
			language
		};

		const frame = frameView(params, gameView(gamesResponse.games, params));
		return reply.type("text/html").send(frame);
	});
}
