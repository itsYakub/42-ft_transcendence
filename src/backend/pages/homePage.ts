import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { homeView } from '../views/homeView.js';
import { frameView } from '../views/frameView.js';
import { UserType } from '../../common/interfaces.js';
import { gamePageView } from './gamePage.js';

/*
	Handles the home page route
*/
export function homePage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const params = {
			user: request.user,
			page: request.url,
			language: request.language
		};
		if (UserType.GUEST == request.user.userType)
			return gamePageView(db, request, reply);
		else
			return reply.type("text/html").send(frameView(params, homeView(request.user)));
	});
}
