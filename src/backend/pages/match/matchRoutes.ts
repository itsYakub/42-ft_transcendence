import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser, markUserOnline } from '../user/userDB.js';
import { localMatchHtml } from '../match/localMatchHtml.js';
import { noUserError } from '../home/homeRoutes.js';
import { joinRoom, roomPlayers } from '../play/playDB.js';
import { matchHtml } from './matchHtml.js';
import { getRoomMessages } from '../messages/messagesDB.js';

export function matchRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/match/local', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		markUserOnline(db, userResponse.user.id);

		const params = {
			user: userResponse.user,
			language
		};

		const frame = frameHtml(params, localMatchHtml(params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/match/local/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const response = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != response.code)
			return reply.type("text/html").send(noUserError(response, language));

	});

	fastify.get('/match/:id', async (request: FastifyRequest, reply: FastifyReply) => {
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

		const frame = frameHtml(params, matchHtml(params));
		return reply.type("text/html").send(frame);
	});
}
