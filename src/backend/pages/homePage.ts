import { FastifyRequest, FastifyReply } from 'fastify';
import { homeView } from '../views/homeView.js';
import { frameView } from '../views/frameView.js';
import { UserType } from '../../common/interfaces.js';
import { getGamePage } from './gamePage.js';

/*
	Handles the home page route
*/
export function getHomePage(request: FastifyRequest, reply: FastifyReply) {
	const user = request.user;
	const language = request.language;
	const page = request.url;

	if (UserType.GUEST == user.userType)
		return getGamePage(request, reply);
	else
		return reply.type("text/html").send(frameView({ user, language }, homeView()));
}
