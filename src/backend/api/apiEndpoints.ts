import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { allNicknames, isUserOnline } from '../db/userDB.js';
import { gamePlayers } from '../db/gameDb.js';
import { messagesString, gamersString } from '../views/matchLobbyView.js';
import { translate } from '../../common/translations.js';
import { Box, Result } from '../../common/interfaces.js';
import { gameChatsList } from '../db/gameChatsDb.js';

export function apiEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {

	fastify.get('/api/nicknames', async (request: FastifyRequest, reply: FastifyReply) => {
		const users = allNicknames(db);
		return reply.send(users);
	});

	// fastify.get('/api/gamers', async (request: FastifyRequest, reply: FastifyReply) => {
	// 	const gamersBox = gamePlayers(db, request.user.gameId);
	// 	if (Result.SUCCESS == gamersBox.result) {
	// 		let text = gamersString(gamersBox.contents, request.user);
	// 		text = translate(request.language, text);

	// 		return reply.send({
	// 			result: Result.SUCCESS,
	// 			value: text
	// 		});
	// 	}
	// 	else
	// 		return reply.send({
	// 			result: Result.ERR_NOT_FOUND
	// 		});
	// });

	fastify.get('/api/game-chats', async (request: FastifyRequest, reply: FastifyReply) => {
		const messagesBox = gameChatsList(db, request.user.gameId);
		if (Result.SUCCESS == messagesBox.result) {
			const html = messagesString(messagesBox.contents, request.user);
			return reply.send({
				result: Result.SUCCESS,
				value: html
			});
		}
		else
			return reply.send({
				result: Result.ERR_NOT_FOUND,
			});
	});

	fastify.get('/api/user-chats/:otherUserId', async (request: FastifyRequest, reply: FastifyReply) => {
		// const user = request.user;
		// const { otherUserId } = request.params as any;

		// const usersResponse = allOtherUsers(db, user.userId);
		// const messagesResponse = userMessages(db, {
		// 	userId: user.userId,
		// 	otherUserId
		// });

		// const messageSendersResponse = getMessageSenders(db, user);
		// if (Result.SUCCESS == messagesResponse.result) {
		// 	const usersHtml = userListString(usersResponse.users, [], messageSendersResponse.ids, otherUserId);
		// 	const messagesHtml = privateMessageListString(user.userId, messagesResponse.messages, otherUserId);

		// 	return reply.send({
		// 		result: Result.SUCCESS,
		// 		usersHtml,
		// 		messagesHtml
		// 	});
		// }
		// else
		// 	return reply.send({
		// 		result: Result.ERR_NOT_FOUND,
		// 	});
	});

	fastify.get('/api/is-online/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.params as any;

		const onlineResponse = isUserOnline(db, userId);
		return onlineResponse;
	});
}
