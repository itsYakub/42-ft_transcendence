import { Router } from '../common/Router.js'
import { FastifyRequest, FastifyReply } from 'fastify';

export class NavRouter extends Router {
	registerRoutes(): void {
		this.fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"])
				return this.addFrame(reply, "home");
			else
				return reply.view("home");
		});
		console.log("Registered nav routes");
	}
}
