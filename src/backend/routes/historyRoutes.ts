import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { getHistory } from '../db/historyDB.js';
import { historyView } from '../views/historyView.js';
import { frameView } from '../views/frameView.js';
import { Result } from '../../common/interfaces.js';

export function historyRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/history', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const historyResponse = getHistory(db, user.userId);
		if (Result.SUCCESS != historyResponse.result) {
			const params = {
				user,
				language,
				result: historyResponse.result
			};
			return reply.type("text/html").send(frameView(params));
		}

		const params = {
			user,
			language
		};

		const frame = frameView(params, historyView(historyResponse.matches, params));
		return reply.type("text/html").send(frame);
	});
}
