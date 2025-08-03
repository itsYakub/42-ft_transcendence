import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { playHtml } from './playHtml.js';

export function playRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/play', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		const params = {
			user,
			page: "play",
			language: request.cookies.language ?? "english"
		};

		const html = playHtml(params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});
}
