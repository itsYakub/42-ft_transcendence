import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { allNicknames, allOtherUsers, getUser } from '../user/userDB.js';
import { gameMessages, gamePlayers } from '../pages/game/gameDB.js';
import { messagesString, gamersString } from '../pages/match/matchHtml.js';
import { privateMessages, getMessageSenders } from '../pages/users/messagesDB.js';
import { privateMessageListString, userListString } from '../pages/users/usersHtml.js';
import { translateBackend } from '../translations.js';

export function apiRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/api/nicknames', async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		const users = allNicknames(db);
		return reply.send(users);
	});

	fastify.get('/api/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		const gamersResponse = gamePlayers(db, { gameID: userResponse.user.gameID });
		if (200 == gamersResponse.code) {
			let html = gamersString(gamersResponse.gamers, userResponse.user);
			html = translateBackend({ html, language});

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

	fastify.get('/api/game-messages', async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		const messagesResponse = gameMessages(db, { gameID: userResponse.user.gameID });
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

	fastify.get('/api/private-messages/:otherUserID', async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		const user = userResponse.user;
		const { otherUserID } = request.params as any;

		const usersResponse = allOtherUsers(db, user);
		const messagesResponse = privateMessages(db, user.id, otherUserID);
		const messageSendersResponse = getMessageSenders(db, user);

		if (200 == messagesResponse.code) {
			const usersHtml = userListString(usersResponse.users, messageSendersResponse.ids, otherUserID);
			const messagesHtml = privateMessageListString(user.id, messagesResponse.messages, userResponse.user);

			return reply.send({
				code: 200,
				usersHtml,
				messagesHtml
			});
		}
		else
			return reply.send({
				code: 404
			});
	});
}
