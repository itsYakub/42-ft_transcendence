import { FastifyRequest, FastifyReply } from 'fastify';
import { frameView } from '../views/frameView.js';
import { usersView } from '../views/usersView.js';
import { translate } from '../../common/translations.js';
import { allUsers } from '../../db/userDB.js';
import { Page, Result } from '../../common/interfaces.js';

export function getUsersPage(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	const language = request.language;

	const usersBox = allUsers(db);
	if (Result.SUCCESS != usersBox.result)
		return reply.type("text/html").send(frameView({
			user,
			language,
			result: usersBox.result
		}));

	let text = usersView(usersBox.contents);
	text = translate(language, text);

	return reply.type("text/html").send(frameView({ user, language, page: Page.USERS }, text));
}
