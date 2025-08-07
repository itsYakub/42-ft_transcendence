import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { playHtml } from './playHtml.js';
import { noUser } from '../home/homeRoutes.js';

export function playRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/play', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		
		if (200 != response.code)
			return reply.type("text/html").send(noUser(response, language, "play"));

		markUserOnline(db, response.user.id);

		const params = {
			user: response.user,
			page: "play",
			language
		};

		const frame = frameHtml(params, playHtml(params));
		return reply.type("text/html").send(frame);
	});
}
