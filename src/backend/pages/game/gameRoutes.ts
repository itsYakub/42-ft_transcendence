import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../../frame/frameHtml.js';
import { getUser } from '../../user/userDB.js';
import { gameHtml } from './gameHtml.js';
import { noUserError } from '../home/homeRoutes.js';
import { getGames, gamePlayers, gameMessages } from './gameDB.js';
import { matchHtml } from '../match/matchHtml.js';

export function gameRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/game', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language, "game"));

		const user = userResponse.user;

		// user is already in a game
		if (user.gameID) {
			const gameID = user.gameID;

			const gamersResponse = gamePlayers(db, { gameID });
			const messagesResponse = gameMessages(db, { gameID });

			const params = {
				gamers: gamersResponse.gamers,
				user,
				page: request.url,
				messages: messagesResponse.messages,
				language
			};

			const frame = frameHtml(params, matchHtml(params));
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
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user: user,
			page: request.url,
			language
		};

		const frame = frameHtml(params, gameHtml(gamesResponse.games, params));
		return reply.type("text/html").send(frame);
	});
}
