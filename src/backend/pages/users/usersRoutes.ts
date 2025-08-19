import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../../frame/frameHtml.js';
import { allOtherUsers, getUser } from '../../user/userDB.js';
import { noUserError } from '../home/homeRoutes.js';
import { usersHtml } from './usersHtml.js';
import { privateMessages, getMessageSenders } from './messagesDB.js';
import { translateBackend } from '../../translations.js';
import { getFriends } from '../friends/friendsDB.js';
import { blockedList } from '../blocked/blockedDB.js';

export function usersRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));
		const user = userResponse.user;

		const usersResponse = allOtherUsers(db, user);
		if (200 != usersResponse.code)
			return reply.type("text/html").send(noUserError(usersResponse, language));

		const friendsResponse = getFriends(db, user);
		if (200 != friendsResponse.code)
			return reply.type("text/html").send(noUserError(friendsResponse, language));

		const blockedResponse = blockedList(db, user);
		if (200 != blockedResponse.code)
			return reply.type("text/html").send(noUserError(blockedResponse, language));

		const messageSendersResponse = getMessageSenders(db, user);
		if (200 != messageSendersResponse.code)
			return reply.type("text/html").send(noUserError(messageSendersResponse, language));

		const params = {
			user: user,
			language
		};

		const messageparams = {
			otherUsers: usersResponse.users,
			friends: friendsResponse.friends,
			blocked: blockedResponse.blocked,
			senders: messageSendersResponse.ids,
			messages: {},
			otherUserID: 0
		}

		const frame = frameHtml(params, usersHtml(messageparams, params));
		return reply.type("text/html").send(frame);
	});

	fastify.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const user = userResponse.user;
		const { otherUserID } = request.body as any;

		const usersResponse = allOtherUsers(db, user);
		if (200 != usersResponse.code)
			return reply.type("text/html").send(noUserError(usersResponse, language));

		const friendsResponse = getFriends(db, user);
		if (200 != friendsResponse.code)
			return reply.type("text/html").send(noUserError(friendsResponse, language));

		const blockedResponse = blockedList(db, user);
		if (200 != blockedResponse.code)
			return reply.type("text/html").send(noUserError(blockedResponse, language));

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
			friends: friendsResponse.friends,
			blocked: blockedResponse.blocked,
			messages: messagesResponse.messages,
			senders: messageSendersResponse.ids,
			otherUserID
		}

		let html = usersHtml(messageparams, params);
		html = translateBackend({ html, language });

		return reply.type("text/html").send(html);
	});
}
