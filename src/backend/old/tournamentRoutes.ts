import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { getTournamentByCode } from './tournamentDb.js';
import { tournamentMatchHtml } from './tournamentMatchHtml.js';
import { localTournamentHtml } from './localTournamentHtml.js';
import { Result } from '../../common/interfaces.js';

export function tournamentRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament/local', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const params = {
			user,
			language
		};

		const frame = frameView(params, localTournamentHtml(params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/tournament/local/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const { id } = request.params as any;

		const tournamentResponse = getTournamentByCode(db, user.nick, id);
		if (Result.SUCCESS != tournamentResponse.result) {
			const params = {
				language,
				user,
				result: tournamentResponse.result
			};
			return reply.type("text/html").send(frameView(params));
		}

		const params = {
			user,
			tournament: tournamentResponse.tournament,
			language
		};

		const html = tournamentMatchHtml(params);

		const frame = frameView(params, html);
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


}
