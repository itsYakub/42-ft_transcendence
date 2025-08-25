import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameView } from '../views/frameView.js';
import { usersView } from '../views/usersView.js';
import { translate } from '../../common/translations.js';
import { allOtherUsers } from '../db/userDB.js';
import { Result } from '../../common/interfaces.js';

export function usersPage(fastify: FastifyInstance, db: DatabaseSync) {
	fastify.get("/users", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
		const page = request.url;

		const usersBox = allOtherUsers(db, user);
		if (Result.SUCCESS != usersBox.result)
			return reply.type("text/html").send(frameView({
				user,
				language,
				result: usersBox.result
			}));

		let text = usersView(usersBox.contents, user);
		text = translate(language, text);

		const frame = frameView({ user, language, page }, text);
		return reply.type("text/html").send(frame);
	});
}
