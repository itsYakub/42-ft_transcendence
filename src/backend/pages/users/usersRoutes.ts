import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../../frame/frameHtml.js';
import { allOtherUsers, getUser } from '../../user/userDB.js';
import { noUserError } from '../home/homeRoutes.js';
import { usersHtml } from './usersHtml.js';
import { privateMessages, getMessageSenders } from './messagesDB.js';
import { translateBackend } from '../../user/translations.js';
import { friendsList } from '../friends/friendsDB.js';
import { blockedList } from '../blocked/blockedDB.js';

export function usersRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));
		const user = userResponse.user;

		const userHtml = usersData(user, language);
		if (200 != userHtml.code)
			return reply.type("text/html").send(frameHtml({ user, language }));

		const frame = frameHtml({ user, language }, userHtml.html);
		return reply.type("text/html").send(frame);
	});

	fastify.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const user = userResponse.user;
		const { otherUserID } = request.body as any;

		const userHtml = usersData(user, language, otherUserID);
		if (200 != userHtml.code)
			return reply.type("text/html").send(frameHtml({ user, language }));

		return reply.type("text/html").send(userHtml.html);
	});

	function usersData(user: any, language: string, otherUserID: number = 0) {
		const usersResponse = allOtherUsers(db, user);
		const friendsResponse = friendsList(db, user);
		const blockedResponse = blockedList(db, user);
		const blockedIDs = blockedResponse.blocked?.map(user => user.BlockedID) || [];
		if (0 == otherUserID)
			otherUserID = usersResponse.users?.find(user => !blockedIDs.includes(user.id))?.id || 0;
		const messagesResponse = privateMessages(db, {
			userID: user.id,
			otherUserID
		});
		const messageSendersResponse = getMessageSenders(db, user);

		if (200 == usersResponse.code && 200 == friendsResponse.code && 200 == blockedResponse.code &&
			200 == messagesResponse.code && 200 == messageSendersResponse.code) {

			const messageparams = {
				otherUsers: usersResponse.users,
				friends: friendsResponse.friends,
				blockedIDs,
				messages: messagesResponse.messages,
				senders: messageSendersResponse.ids,
				otherUserID,
				user
			};

			let html = usersHtml(messageparams);
			html = translateBackend({ html, language });

			return {
				code: 200,
				html
			};
		}

		return {
			code: 200,
			error: "ERR_DB"
		};
	}
}
