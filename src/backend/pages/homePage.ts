import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { homeView } from '../views/homeView.js';
import { frameView } from '../views/frameView.js';

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
		return reply.type("text/html").send(frameView(params, homeView(request.user)));
	});
}
