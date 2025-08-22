import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { usersView } from '../views/usersView.js';
import { userMessages, getMessageSenders } from '../db/userChatsDb.js';
import { translateBackend } from '../../common/translations.js';
import { friendsList } from '../db/friendsDb.js';
import { getFoes } from '../db/foesDb.js';
import { allOtherUsers } from '../db/userDB.js';
import { Result, User } from '../../common/interfaces.js';

export function usersRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const userHtml = usersData(user, language);
		if (Result.SUCCESS != userHtml.result)
			return reply.type("text/html").send(frameView({ user, language }));

		const frame = frameView({ user, language }, userHtml.text);
		return reply.type("text/html").send(frame);
	});

	fastify.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
		const { otherUserID } = request.body as any;

		const userHtml = usersData(user, language, otherUserID);
		if (Result.SUCCESS != userHtml.result)
			return reply.type("text/html").send(frameView({ user, language }));

		return reply.type("text/html").send(userHtml.text);
	});

	function usersData(user: User, language: string, otherUserId: number = 0) {
		const usersResponse = allOtherUsers(db, user.userId);
		const friendsResponse = friendsList(db, user);
		const foesBox = getFoes(db, user);
		const foeIds = foesBox.foes?.map(user => user.BlockedID) || [];
		if (0 == otherUserId)
			otherUserId = usersResponse.users?.find(user => !foeIds.includes(user.userId))?.userId || 0;
		const messagesResponse = userMessages(db, {
			userId: user.userId,
			otherUserId
		});
		const messageSendersResponse = getMessageSenders(db, user);

		if (Result.SUCCESS == usersResponse.result && Result.SUCCESS == friendsResponse.result && Result.SUCCESS == foesBox.result &&
			Result.SUCCESS == messagesResponse.result && Result.SUCCESS == messageSendersResponse.result) {

			const messageparams = {
				otherUsers: usersResponse.users,
				friends: friendsResponse.friends,
				foeIds,
				messages: messagesResponse.messages,
				senders: messageSendersResponse.ids,
				otherUserId,
				user
			};

			let text = usersView(messageparams);
			text = translateBackend(language, text);

			return {
				result: Result.SUCCESS,
				text
			};
		}

		return {
			result: Result.ERR_DB
		};
	}
}
