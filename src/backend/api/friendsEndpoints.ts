import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addFriend, removeFriend } from '../db/friendsDb.js';
import { getUserByEmail } from '../db/userDB.js';
import { Result } from '../../common/interfaces.js';

export function friendsEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/friends/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const json = request.body as any;
		json["id"] = user.userId;

		const response = addFriend(db, json);
		return reply.send(response);
	});

	fastify.post("/friends/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const json = request.body as any;
		json["id"] = user.userId;

		const response = removeFriend(db, json);
		return reply.send(response);
	});

	fastify.post("/friends/find", async (request: FastifyRequest, reply: FastifyReply) => {
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

		addFriend(db, {
			userId: user.userId,
			friendId: userBox.user.userId
		});
		return reply.send(userBox);
	});
}
