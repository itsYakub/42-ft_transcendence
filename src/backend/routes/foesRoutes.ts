import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { getFoes } from '../db/foesDb.js';
import { foesView } from '../views/foesView.js';
import { Result } from '../../common/interfaces.js';

export function foesRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/foes', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const foesBox = getFoes(db, user);
		if (Result.SUCCESS != foesBox.result) {
			const params = {
				user,
				language,
				result: foesBox.result
			};
			return reply.type("text/html").send(frameView(params));
		}

		const params = {
			user,
			language
		};
		const html = foesView(foesBox.foes, params);

		const frame = frameView(params, html);
		return reply.type("text/html").send(frame);
	});
}
