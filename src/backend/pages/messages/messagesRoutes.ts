import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../../frame/frameHtml.js';
import { allOtherUsers, getUser } from '../../user/userDB.js';
import { noUserError } from '../home/homeRoutes.js';
import { messagesHtml } from './messagesHtml.js';
import { privateMessages, getMessageSenders } from './messagesDB.js';

export function messageRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/messages", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));
		const user = userResponse.user;

		const usersResponse = allOtherUsers(db, user);

		const messageSendersResponse = getMessageSenders(db, user);

		if (200 != messageSendersResponse.code)
			return reply.type("text/html").send(noUserError(messageSendersResponse, language));

		const params = {
			user: user,
			language
		};

		const messageparams = {
			otherUsers: usersResponse.users,
			messages: {},
			senders: messageSendersResponse.ids,
			otherUserID: 0
		}

		const frame = frameHtml(params, messagesHtml(messageparams, params));
		return reply.type("text/html").send(frame);
	});

	fastify.post("/messages", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const user = userResponse.user;
		const { otherUserID } = request.body as any;

		const usersResponse = allOtherUsers(db, user);
		const messagesResponse = privateMessages(db, user.id, otherUserID);

		if (200 != messagesResponse.code)
			return reply.type("text/html").send(noUserError(messagesResponse, language));

		const messageSendersResponse = getMessageSenders(db, user);

		if (200 != messageSendersResponse.code)
			return reply.type("text/html").send(noUserError(messageSendersResponse, language));

		const params = {
			user: userResponse.user,
			language
		};

		const messageparams = {
			otherUsers: usersResponse.users,
			messages: messagesResponse.messages,
			senders: messageSendersResponse.ids,
			otherUserID
		}

		return reply.type("text/html").send(messagesHtml(messageparams, params));
	});
}
