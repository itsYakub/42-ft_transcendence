import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { addTournament, getTournamentByCode, updateTournament } from './tournamentDB.js';
import { tournamentMatchHtml } from './tournamentMatchHtml.js';
import { noUserError } from '../home/homeRoutes.js';
import { localTournamentHtml } from './localTournamentHtml.js';
import { joinRoom, roomPlayers } from '../play/playDB.js';
import { getRoomMessages } from '../messages/messagesDB.js';
import { tournamentHtml } from './tournamentHtml.js';

export function tournamentRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament/local', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (200 != response.code)
			return reply.type("text/html").send(noUserError(response, language));

		markUserOnline(db, response.user.id);

		const params = {
			user: response.user,
			language
		};

		const frame = frameHtml(params, localTournamentHtml(params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/tournament/local/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != response.code)
			return reply.type("text/html").send(noUserError(response, language));

		const { id } = request.params as any;

		markUserOnline(db, response.user.id);

		const tournament = getTournamentByCode(db, id);
		const params = { user: response.user, tournament, page: "tournamentMatch", language: request.cookies.language ?? "english" };

		const html = tournamentMatchHtml(params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.get('/tournament/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const { id } = request.params as any;

		markUserOnline(db, userResponse.user.id);

		const roomResponse = joinRoom(db, {
			roomID: id,
			user: userResponse.user
		});

		if (200 != roomResponse.code) {
			const params = {
				language,
				user: userResponse.user,
				errorCode: roomResponse.code,
				errorMessage: roomResponse.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		userResponse.user["roomID"] = id;
		const playersResponse = roomPlayers(db, { roomID: id });
		const messagesResponse = getRoomMessages(db, id);

		const params = {
			players: playersResponse.players,
			user: userResponse.user,
			messages: messagesResponse.messages,
			language
		};

		const frame = frameHtml(params, tournamentHtml(params));
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
