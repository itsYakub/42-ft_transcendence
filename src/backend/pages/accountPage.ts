import { FastifyRequest, FastifyReply } from 'fastify';
import { accountView } from '../views/accountView.js';
import { frameView } from '../views/frameView.js';

export function getAccountPage(request: FastifyRequest, reply: FastifyReply) {
	const user = request.user;
	const language = request.language;
	const page = request.url;

	return reply.type("text/html").send(frameView({ user, language, page }, accountView(user)));
}
