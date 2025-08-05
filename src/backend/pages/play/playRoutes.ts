import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { playHtml } from './playHtml.js';
import { localMatchHtml } from './localMatchHtml.js';
import { localTournamentHtml } from './localTournamentHtml.js';

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

	fastify.get('/play/match', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		const params = {
			user,
			page: "localMatch",
			language: request.cookies.language ?? "english"
		};

		const html = localMatchHtml(params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.get('/play/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		const params = {
			user,
			page: "localTournament",
			language: request.cookies.language ?? "english"
		};

		const html = localTournamentHtml(params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});
}
