import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { addFriend, friendsList, removeFriend } from '../db/friendsDb.js';
import { getUserByEmail } from '../db/userDB.js';
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { friendsView } from '../views/friendsView.js';

export function friendsEndpoints(fastify: FastifyInstance) {
	fastify.get("/api/friends", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		const language = request.language;

		const friendsBox = friendsList(db, user.userId);
		if (Result.SUCCESS != friendsBox.result)
			return reply.send(friendsBox);

		return reply.send(JSON.stringify({
			result: Result.SUCCESS,
			value: translate(language, friendsView(friendsBox.contents))
		}));
	});

	fastify.post("/api/friends/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		const { friendId } = request.body as any;
		return reply.send(addFriend(db, user.userId, friendId));
	});

	fastify.post("/api/friends/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		const { friendId } = request.body as any;
		return reply.send(removeFriend(db, user.userId, friendId));
	});

	fastify.post("/api/friends/find", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		const json = request.body as any;
		if (user.email == json.email) {
			return reply.send({
				result: Result.ERR_SAME_EMAIL
			});
		}

		const userBox = getUserByEmail(db, json.email);
		if (Result.SUCCESS != userBox.result)
			return reply.send(userBox);

		addFriend(db, user.userId, userBox.contents.userId);
		return reply.send(userBox);
	});
}
