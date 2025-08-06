import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { addMatch, getMatches } from './matchDB.js';
import { matchHtml } from './matchHtml.js';
import { noUser } from '../home/homeRoutes.js';

export function matchRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/matches', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUser(userResponse, language));

		markUserOnline(db, userResponse.user.id);

		const matchesResponse = getMatches(db, userResponse.user.id);
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
		const html = matchHtml(matchesResponse.matches, params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.post("/match/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.code(user.code).send(user);

		const params = JSON.parse(request.body as string);
		params["id"] = user.id;

		const response = addMatch(db, params);
		return reply.send(response);
	});
}
