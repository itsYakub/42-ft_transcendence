import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser } from '../user/userDB.js';
import { localMatchHtml } from '../match/localMatchHtml.js';
import { noUserError } from '../home/homeRoutes.js';

export function matchRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/match', async (request: FastifyRequest, reply: FastifyReply) => {
		// const language = request.cookies.language ?? "english";
		// const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		// if (200 != userResponse.code)
		// 	return reply.type("text/html").send(noUserError(userResponse, language));
		// const user = userResponse.user;

		// if (!user.roomID) {
		// 	const params = {
		// 		user: user,
		// 		errorCode: 404,
		// 		errorMessage: "ERR_NOT_FOUND",
		// 		language: request.cookies.language ?? "english"
		// 	};
		// 	const frame = frameHtml(params);
		// 	return reply.type("text/html").send(frame);
		// }

		// const roomID = user.roomID;

		// const playersResponse = roomPlayers(db, { roomID });
		// const messagesResponse = roomMessages(db, { roomID });

		// const params = {
		// 	players: playersResponse.players,
		// 	user,
		// 	messages: messagesResponse.messages,
		// 	language
		// };

		// const frame = frameHtml(params, matchHtml(params));
		// return reply.type("text/html").send(frame);
	});

	fastify.get('/match/local', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		//markUserOnline(db, userResponse.user.id);

		const params = {
			user: userResponse.user,
			language
		};

		const frame = frameHtml(params, localMatchHtml(params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/match/local/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != response.code)
			return reply.type("text/html").send(noUserError(response, language));

	});
}
