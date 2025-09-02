import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { addFoe, foesList, removeFoe } from '../db/foesDb.js';
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { foesView } from '../views/foesView.js';

export function foesEndpoints(fastify: FastifyInstance): void {
	fastify.get('/api/foes', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		const language = request.language;

		const foesBox = foesList(db, user.userId);
		if (Result.SUCCESS != foesBox.result)
			return reply.send(foesBox);

		return reply.send(JSON.stringify({
			result: Result.SUCCESS,
			value: translate(language, foesView(foesBox.contents))
		}));
	});

	fastify.post("/api/foes/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		const { foeId } = request.body as any;
		return reply.send(addFoe(db, user.userId, foeId));
	});

	fastify.post("/api/foes/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		const { foeId } = request.body as any;
		return reply.send(removeFoe(db, user.userId, foeId));
	});
}
