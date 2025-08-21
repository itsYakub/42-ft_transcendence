import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { friendsList } from '../db/friendsDB.js';
import { friendsView } from '../views/friendsView.js';
import { frameView } from '../views/frameView.js';
import { result } from '../../common/interfaces.js';

export function friendsRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/friends', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const friendsBox = friendsList(db, user);
		if (result.SUCCESS != friendsBox.result) {
			const params = {
				user,
				language,
				result: friendsBox.result,
			};
			return reply.type("text/html").send(frameView(params));
		}

		const params = {
			user,
			language
		};
		const html = friendsView(friendsBox.friends, params);

		const frame = frameView(params, html);
		return reply.type("text/html").send(frame);
	});
}
