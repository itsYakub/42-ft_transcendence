import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Result } from '../../common/interfaces.js';
import { incomingChatsList, outgoingChatsList, partnerChats } from '../db/userChatsDb.js';
import { userChatsMessages } from '../../common/dynamicElements.js';
import { allChattableUsers, getUserById } from '../db/userDB.js';
import { foesList } from '../db/foesDb.js';
import { notificationsList } from '../db/notificationsDb.js';

export function userChatsEndpoints(fastify: FastifyInstance): void {
	fastify.post('/api/chats', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		const { partnerId } = request.body as any;

		const chatsBox = partnerChats(db, user.userId, partnerId);
		if (Result.SUCCESS != chatsBox.result)
			return reply.send(chatsBox);

		const userBox = getUserById(db, partnerId);
		if (Result.SUCCESS != userBox.result)
			return reply.send(userBox);

		return reply.send({
			result: Result.SUCCESS,
			contents: {
				messages: userChatsMessages(chatsBox.contents, partnerId),
				partner: userBox.contents
			}
		});
	});

	fastify.get("/api/chats/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		// const notificationsBox = notificationsList(db, user.userId);
		// if (Result.SUCCESS != notificationsBox.result)
		// 	return reply.send(notificationsBox.result);

		const incomingChatsBox = incomingChatsList(db, user.userId);
		if (Result.SUCCESS != incomingChatsBox.result)
			return reply.send(incomingChatsBox.result);

		const outgoingChatsBox = outgoingChatsList(db, user.userId);
		if (Result.SUCCESS != outgoingChatsBox.result)
			return reply.send(outgoingChatsBox.result);

		const foesBox = foesList(db, user.userId);
		if (Result.SUCCESS != foesBox.result)
			return reply.send(foesBox.result);

		const incomingChats = incomingChatsBox.contents.map(c => c.userId);
		const outgoingChats = outgoingChatsBox.contents.map(c => c.userId);
		const foesChats = foesBox.contents.map(f => f.foeId);

		const chattableUsers = allChattableUsers(db, user);
		if (Result.SUCCESS != chattableUsers.result)
			return reply.send(chattableUsers.result);

		const output = chattableUsers.contents.filter(c => !incomingChats.includes(c.userId) && !outgoingChats.includes(c.userId) && !foesChats.includes(c.userId))

		return reply.send({
			result: Result.SUCCESS,
			contents: output
		});
	});

	fastify.get('/api/chats/notifications', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		const notificationsBox = notificationsList(db, user.userId);
		return reply.send(notificationsBox);
	});
}
