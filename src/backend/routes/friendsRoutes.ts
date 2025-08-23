import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { friendsList } from '../db/friendsDb.js';
import { friendsView } from '../views/friendsView.js';
import { Result } from '../../common/interfaces.js';
import { translateBackend } from '../../common/translations.js';

export function friendsRoutes(fastify: FastifyInstance, db: DatabaseSync) {
	fastify.get("/friends", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
		const friendsBox = friendsList(db, user);
		if (Result.SUCCESS != friendsBox.result) {
			return reply.type("text/html").send(friendsBox);
		}

		return reply.type("text/html").send(JSON.stringify({
			result: Result.SUCCESS,
			value: translateBackend(language, friendsView(friendsBox.friends, user))
		}));
	});
}
