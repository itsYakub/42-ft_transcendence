import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { allNicknames, allOtherUsers, isUserOnline } from '../db/userDB.js';
import { gameMessages, gamePlayers } from '../db/gameDB.js';
import { messagesString, gamersString } from '../views/matchHtml.js';
import { privateMessages, getMessageSenders } from '../db/messagesDB.js';
import { privateMessageListString, userListString } from '../views/usersView.js';
import { translateBackend } from '../../common/translations.js';

export function apiRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/api/nicknames', async (request: FastifyRequest, reply: FastifyReply) => {
		const users = allNicknames(db);
		return reply.send(users);
	});

	fastify.get('/api/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const gamersResponse = gamePlayers(db, { gameID: request.user.gameId });
		if (200 == gamersResponse.code) {
			let html = gamersString(gamersResponse.gamers, request.user);
			html = translateBackend({ html, language: request.language });

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
		const messagesResponse = gameMessages(db, { gameID: request.user.gameId });
		if (200 == messagesResponse.code) {
			const html = messagesString(messagesResponse.messages, request.user);
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

	fastify.get('/api/private-messages/:otherUserId', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const { otherUserId } = request.params as any;

		const usersResponse = allOtherUsers(db, user);
		const messagesResponse = privateMessages(db, {
			userId: user.userId,
			otherUserId
		});

		const messageSendersResponse = getMessageSenders(db, user);
		if (200 == messagesResponse.code) {
			const usersHtml = userListString(usersResponse.users, [], messageSendersResponse.ids, otherUserId);
			const messagesHtml = privateMessageListString(user.userId, messagesResponse.messages, otherUserId);

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

	fastify.get('/api/is-online/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.params as any;

		const onlineResponse = isUserOnline(db, userId);
		return onlineResponse;
	});
}
