import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { usersView } from '../views/usersView.js';
import { privateMessages, getMessageSenders } from '../db/messagesDB.js';
import { translateBackend } from '../../common/translations.js';
import { friendsList } from '../db/friendsDB.js';
import { getFoes } from '../db/foesDB.js';
import { allOtherUsers } from '../db/userDB.js';
import { result } from '../../common/interfaces.js';

export function usersRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const userHtml = usersData(user, language);
		if (200 != userHtml.code)
			return reply.type("text/html").send(frameView({ user, language }));

		const frame = frameView({ user, language }, userHtml.html);
		return reply.type("text/html").send(frame);
	});

	fastify.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
		const { otherUserID } = request.body as any;

		const userHtml = usersData(user, language, otherUserID);
		if (200 != userHtml.code)
			return reply.type("text/html").send(frameView({ user, language }));

		return reply.type("text/html").send(userHtml.html);
	});

	function usersData(user: any, language: string, otherUserId: number = 0) {
		const usersResponse = allOtherUsers(db, user);
		const friendsResponse = friendsList(db, user);
		const foesBox = getFoes(db, user);
		const foeIDs = foesBox.foes?.map(user => user.BlockedID) || [];
		if (0 == otherUserId)
			otherUserId = usersResponse.users?.find(user => !foeIDs.includes(user.id))?.id || 0;
		const messagesResponse = privateMessages(db, {
			userId: user.id,
			otherUserId
		});
		const messageSendersResponse = getMessageSenders(db, user);

		if (result.SUCCESS == usersResponse.result && 200 == friendsResponse.code && result.SUCCESS == foesBox.result &&
			result.SUCCESS == messagesResponse.result && result.SUCCESS == messageSendersResponse.result) {

			const messageparams = {
				otherUsers: usersResponse.users,
				friends: friendsResponse.friends,
				foeIDs,
				messages: messagesResponse.messages,
				senders: messageSendersResponse.ids,
				otherUserId,
				user
			};

			let html = usersView(messageparams);
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
