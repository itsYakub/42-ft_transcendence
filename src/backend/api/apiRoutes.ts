import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { allNicknames, allOtherUsers, isUserOnline } from '../db/userDB.js';
import { gamePlayers } from '../db/gameDb.js';
import { messagesString, gamersString } from '../views/matchHtml.js';
import { userMessages, getMessageSenders } from '../db/userChatsDb.js';
import { privateMessageListString, userListString } from '../views/usersView.js';
import { translateBackend } from '../../common/translations.js';
import { Result } from '../../common/interfaces.js';
import { gameChats } from '../db/gameChatsDb.js';

export function apiRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/api/nicknames', async (request: FastifyRequest, reply: FastifyReply) => {
		const users = allNicknames(db);
		return reply.send(users);
	});

	fastify.get('/api/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
		const gamersResponse = gamePlayers(db, request.user.gameId);
		if (Result.SUCCESS == gamersResponse.result) {
			let text = gamersString(gamersResponse.gamers, request.user);
			text = translateBackend(request.language, text);

			return reply.send({
				result: Result.SUCCESS,
				text
			});
		}
		else
			return reply.send({
				result: Result.ERR_NOT_FOUND
			});
	});

	fastify.get('/api/game-messages', async (request: FastifyRequest, reply: FastifyReply) => {
		const messagesResponse = gameChats(db, request.user.gameId);
		if (Result.SUCCESS == messagesResponse.result) {
			const html = messagesString(messagesResponse.messages, request.user);
			return reply.send({
				result: Result.SUCCESS,
				html
			});
		}
		else
			return reply.send({
				result: Result.ERR_NOT_FOUND,
			});
	});

	fastify.get('/api/user-chats/:otherUserId', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const { otherUserId } = request.params as any;

		const usersResponse = allOtherUsers(db, user.userId);
		const messagesResponse = userMessages(db, {
			userId: user.userId,
			otherUserId
		});

		const messageSendersResponse = getMessageSenders(db, user);
		if (Result.SUCCESS == messagesResponse.result) {
			const usersHtml = userListString(usersResponse.users, [], messageSendersResponse.ids, otherUserId);
			const messagesHtml = privateMessageListString(user.userId, messagesResponse.messages, otherUserId);

			return reply.send({
				result: Result.SUCCESS,
				usersHtml,
				messagesHtml
			});
		}
		else
			return reply.send({
				result: Result.ERR_NOT_FOUND,
			});
	});

	fastify.get('/api/is-online/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.params as any;

		const onlineResponse = isUserOnline(db, userId);
		return onlineResponse;
	});
}
