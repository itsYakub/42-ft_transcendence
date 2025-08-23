import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { usersView } from '../views/usersView.js';
import { userMessages, getMessageSenders } from '../db/userChatsDb.js';
import { translateBackend } from '../../common/translations.js';
import { friendsList } from '../db/friendsDb.js';
import { getFoes } from '../db/foesDb.js';
import { allOtherUsers } from '../db/userDB.js';
import { Result, StringBox, User } from '../../common/interfaces.js';

export function usersRoutes(fastify: FastifyInstance, db: DatabaseSync) {
	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
		const page = request.url;

		const usersBox = usersData(user, language);
		if (Result.SUCCESS != usersBox.result)
			return reply.type("text/html").send(frameView({ user, language }));

		const frame = frameView({ user, language, page }, usersBox.value);
		return reply.type("text/html").send(frame);
	});

	fastify.post("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
		const { selectedUserId } = request.body as any;

		const usersBox = usersData(user, language, selectedUserId);

		if (Result.SUCCESS != usersBox.result)
			return reply.type("text/html").send(frameView({ user, language }));

		return reply.type("text/html").send(JSON.stringify(usersBox));
	});

	function usersData(user: User, language: string, selectedUserId: number = 0): StringBox {
		const usersBox = allOtherUsers(db, user.userId);
		const friendsBox = friendsList(db, user);
		const foesBox = getFoes(db, user.userId);
		if (0 == selectedUserId)
			selectedUserId = usersBox.users?.length > 0 ? usersBox.users[0].userId : 0;	
		const selectedUser = usersBox.users?.find(user => user.userId == selectedUserId);	

		if (Result.SUCCESS == usersBox.result && Result.SUCCESS == friendsBox.result && Result.SUCCESS == foesBox.result) {
			let text = usersView(usersBox.users, friendsBox.friends, foesBox.foes, selectedUser, user);
			text = translateBackend(language, text);
			return {
				result: Result.SUCCESS,
				value: text
			};
		}

		return {
			result: Result.ERR_DB
		};
	}
}
