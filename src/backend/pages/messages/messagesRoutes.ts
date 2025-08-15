import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { allOtherUsers, getUser, markUserOnline } from '../user/userDB.js';
import { noUserError } from '../home/homeRoutes.js';
import { messagesHtml } from './messagesHtml.js';
import { addMessage, getMessages, getMessageSenders } from './messagesDB.js';
import { leaveRoom } from '../play/playDB.js';

export function messageRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/messages', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));
		const id = userResponse.user.id;

		markUserOnline(db, id);
		leaveRoom(db, userResponse);

		const usersResponse = allOtherUsers(db, id);

		const messageSendersResponse = getMessageSenders(db, id);
		if (200 != messageSendersResponse.code)
			return reply.type("text/html").send(noUserError(messageSendersResponse, language));

		const params = {
			user: userResponse.user,
			language
		};

		const messageparams = {
			users: usersResponse.users,
			messages: {},
			senders: messageSendersResponse.ids,
			fromID: 0
		}

		const frame = frameHtml(params, messagesHtml(messageparams, params));
		return reply.type("text/html").send(frame);
	});

	fastify.get('/messages/:fromID', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));
		const id = userResponse.user.id;

		const { fromID } = request.params as any;

		markUserOnline(db, id);
		leaveRoom(db, userResponse);

		const usersResponse = allOtherUsers(db, id);
		const messagesResponse = getMessages(db, id, fromID);
		if (200 != messagesResponse.code)
			return reply.type("text/html").send(noUserError(messagesResponse, language));

		const messageSendersResponse = getMessageSenders(db, id);
		if (200 != messageSendersResponse.code)
			return reply.type("text/html").send(noUserError(messageSendersResponse, language));

		const params = {
			user: userResponse.user,
			language
		};

		const messageparams = {
			users: usersResponse.users,
			messages: messagesResponse.messages,
			senders: messageSendersResponse.ids,
			fromID
		}

		const frame = frameHtml(params, messagesHtml(messageparams, params));
		return reply.type("text/html").send(frame);
	});

	fastify.post('/messages/add', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const params = JSON.parse(request.body as string);
		params["fromID"] = userResponse.user.id;

		const response = addMessage(db, params);
		return reply.send(response);
	});
}
