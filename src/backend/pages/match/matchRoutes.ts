import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { localMatchHtml } from '../match/localMatchHtml.js';
import { noUser } from '../home/homeRoutes.js';

export function matchRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/match/local', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != response.code)
			return reply.type("text/html").send(noUser(response, language));

		markUserOnline(db, response.user.id);

		const params = {
			user: response.user,
			language
		};

		const frame = frameHtml(params, localMatchHtml(params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/match/local/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != response.code)
			return reply.type("text/html").send(noUser(response, language));

	});

	fastify.get('/match/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != response.code)
			return reply.type("text/html").send(noUser(response, language));

		const { id } = request.params as any;

		markUserOnline(db, response.user.id);

		// const tournament = getTournamentByCode(db, id);
		// const params = { user: response.user, tournament, page: "tournamentMatch", language: request.cookies.language ?? "english" };

		// const html = tournamentMatchHtml(params);

		// const frame = frameHtml(params, html);
		return reply.type("text/html").send("match");
	});
}
