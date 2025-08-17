import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { allNicknames, getUser } from '../pages/user/userDB.js';
import { roomPlayers } from '../pages/play/playDB.js';
import { messagesString, playersString } from '../pages/match/matchHtml.js';
import { roomMessages } from '../pages/messages/messagesDB.js';

export function apiRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/api/nicknames', async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		const users = allNicknames(db);
		return reply.send(users);
	});

	fastify.get('/api/players', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		const playersResponse = roomPlayers(db, { roomID: userResponse.user.roomID });
		if (200 == playersResponse.code) {
			const html = playersString(playersResponse.players, userResponse.user, language);

			return reply.send({
				code: 200,
				html
			});
		}
		else
			return reply.send({
				code: 404
			});
	});

	fastify.get('/api/messages', async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		const messagesResponse = roomMessages(db, { roomID: userResponse.user.roomID });
		if (200 == messagesResponse.code) {
			const html = messagesString(messagesResponse.messages, userResponse.user);

			return reply.send({
				code: 200,
				html
			});
		}
		else
			return reply.send({
				code: 404
			});
	});
}
