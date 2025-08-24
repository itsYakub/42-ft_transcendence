import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { localMatchHtml } from './localMatchHtml.js';
import { frameView } from '../views/frameView.js';

export function matchRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/match', async (request: FastifyRequest, reply: FastifyReply) => {
		// const language = request.cookies.language ?? "english";
		// const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		// if (200 != userResponse.code)
		// 	return reply.type("text/html").send(noUserError(userResponse, language));
		// const user = userResponse.user;

		// if (!user.gameID) {
		// 	const params = {
		// 		user: user,
		// 		errorCode: 404,
		// 		errorMessage: "ERR_NOT_FOUND",
		// 		language: request.cookies.language ?? "english"
		// 	};
		// 	const frame = frameHtml(params);
		// 	return reply.type("text/html").send(frame);
		// }

		// const gameID = user.gameID;

		// const gamersResponse = gamePlayers(db, { gameID });
		// const messagesResponse = gameMessages(db, { gameID });

		// const params = {
		// 	gamers: gamersResponse.gamers,
		// 	user,
		// 	messages: messagesResponse.messages,
		// 	language
		// };

		// const frame = frameHtml(params, matchHtml(params));
		// return reply.type("text/html").send(frame);
	});

	fastify.get('/match/local', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		//markUserOnline(db, userResponse.user.id);

		const params = {
			user,
			language
		};

		const frame = frameView(params, localMatchHtml(params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/match/local/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
	});
}
