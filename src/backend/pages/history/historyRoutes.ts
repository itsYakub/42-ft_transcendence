import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { addHistory, getHistory } from './historyDB.js';
import { historyHtml } from './historyHtml.js';
import { noUserError } from '../home/homeRoutes.js';
import { leaveRoom } from '../play/playDB.js';

export function historyRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/history', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		//markUserOnline(db, userResponse.user.id);
		//leaveRoom(db, userResponse);

		const matchesResponse = getHistory(db, userResponse.user.id);
		if (matchesResponse.error) {
			const params = {
				user: userResponse.user,
				language,
				errorCode: matchesResponse.code,
				errorMessage: matchesResponse.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user: userResponse.user,
			language
		};

		const frame = frameHtml(params, historyHtml(matchesResponse.matches, params));
		return reply.type("text/html").send(frame);
	});

	fastify.post("/history/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.code(user.code).send(user);

		const params = JSON.parse(request.body as string);
		params["id"] = user.id;

		const response = addHistory(db, params);
		return reply.send(response);
	});
}
