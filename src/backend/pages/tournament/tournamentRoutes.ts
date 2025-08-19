import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../../frame/frameHtml.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { addTournament, getTournamentByCode, updateTournament } from './tournamentDB.js';
import { tournamentMatchHtml } from './tournamentMatchHtml.js';
import { noUserError } from '../home/homeRoutes.js';
import { localTournamentHtml } from './localTournamentHtml.js';

export function tournamentRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament/local', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (200 != response.code)
			return reply.type("text/html").send(noUserError(response, language));

		const params = {
			user: response.user,
			language
		};

		const frame = frameHtml(params, localTournamentHtml(params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/tournament/local/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const { id } = request.params as any;

		const tournamentResponse = getTournamentByCode(db, userResponse.user.nick, id);
		if (200 != tournamentResponse.code) {
			const params = {
				language,
				user: userResponse.user,
				errorCode: tournamentResponse.code,
				errorMessage: tournamentResponse.error
			};
			return reply.type("text/html").send(frameHtml(params));
		}

		const params = {
			user: userResponse.user,
			tournament: tournamentResponse.tournament,
			language
		};

		const html = tournamentMatchHtml(params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	// fastify.get('/tournament/:id', async (request: FastifyRequest, reply: FastifyReply) => {
	// 	const language = request.cookies.language ?? "english";
	// 	const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
	// 	if (200 != userResponse.code)
	// 		return reply.type("text/html").send(noUserError(userResponse, language));

	// 	const { id } = request.params as any;

	// 	const gameResponse = joinRoom(db, {
	// 		gameID: id,
	// 		user: userResponse.user
	// 	});

	// 	if (200 != gameResponse.code) {
	// 		const params = {
	// 			language,
	// 			user: userResponse.user,
	// 			errorCode: gameResponse.code,
	// 			errorMessage: gameResponse.error
	// 		};
	// 		return reply.type("text/html").send(frameHtml(params));
	// 	}

	// 	userResponse.user["gameID"] = id;
	// 	const gamersResponse = gamePlayers(db, { gameID: id });
	// 	const messagesResponse = gameMessages(db, {gameID: id});

	// 	const params = {
	// 		gamers: gamersResponse.gamers,
	// 		user: userResponse.user,
	// 		messages: messagesResponse.messages,
	// 		language
	// 	};

	// 	const frame = frameHtml(params, tournamentHtml(params));
	// 	return reply.type("text/html").send(frame);
	// });

	fastify.post('/tournament/add', async (request: FastifyRequest, reply: FastifyReply) => {
		const response = addTournament(db, request.body as any);
		return reply.send(response);
	});

	fastify.post('/tournament/update', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		const params = request.body as any;
		params["user"] = user;

		const response = updateTournament(db, params);
		return reply.send(response);
	});
}
