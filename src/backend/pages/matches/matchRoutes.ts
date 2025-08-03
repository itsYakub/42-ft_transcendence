import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { addMatch, getMatches } from './matchDB.js';
import { matchHtml } from './matchHtml.js';

export function matchRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/matches', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.redirect("/");

		markUserOnline(db, user.id);

		const response = getMatches(db, user.id);
		if (response.error) {
			const params = {
				user,
				page: "matches",
				language: request.cookies.language ?? "english",
				errorCode: response.code,
				errorMessage: response.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user,
			page: "matches",
			language: request.cookies.language ?? "english"
		};
		const html = matchHtml(response.matches, params);

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
