import { FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { translate } from '../../common/translations.js';
import { Page, Result } from '../../common/interfaces.js';
import { readFoes } from '../../db/foesDb.js';
import { foesView } from '../views/foesView.js';

export function getFoesPage(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const usersBox = readFoes(db, user.userId);
	if (Result.SUCCESS != usersBox.result)
		return reply.type("text/html").send(frameView({
			language,
			result: usersBox.result,
			user
		}));

	let text = foesView(usersBox.contents);
	text = translate(language, text);

	return reply.type("text/html").send(frameView({ user, language, page: Page.FOES }, text));
}
