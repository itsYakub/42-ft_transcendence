import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { Result } from '../../common/interfaces.js';
import { partnerChats } from '../db/userChatsDb.js';
import { userChatsMessages } from '../../common/dynamicElements.js';

export function userChatsEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post('/api/chats', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const { partnerId } = request.body as any;

		const chatsBox = partnerChats(db, user.userId, partnerId);
		if (Result.SUCCESS != chatsBox.result)
			return reply.send(chatsBox);

		return reply.send({
			result: Result.SUCCESS,
			value: userChatsMessages(chatsBox.contents, partnerId)
		});
	});
}
