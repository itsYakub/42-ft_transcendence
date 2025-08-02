import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { addTournament, getTournamentByCode, updateTournament } from './tournamentDB.js';
import { tournamentHtml } from './tournamentHtml.js';
import { tournamentMatchHtml } from './tournamentMatchHtml.js';

export function tournamentRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.id)
			markUserOnline(db, user.id);

		const params = {
			user,
			page: "tournament",
			language: request.cookies.language ?? "english"
		};
		const html = tournamentHtml(params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.get('/tournament/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		const { id } = request.params as any;

		if (user.id)
			markUserOnline(db, user.id);

		const tournament = getTournamentByCode(db, id);
		const params = { user, tournament, page: "tournamentMatch", language: request.cookies.language ?? "english" };

		const html = tournamentMatchHtml(params);
		
		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.post('/tournament/add', async (request: FastifyRequest, reply: FastifyReply) => {
		const params = JSON.parse(request.body as string);

		const response = addTournament(db, params);
		return reply.send(response);
	});

	fastify.post('/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		const params = JSON.parse(request.body as string);
		params["user"] = user;

		const response = updateTournament(db, params);
		return reply.send(response);
	});
}
