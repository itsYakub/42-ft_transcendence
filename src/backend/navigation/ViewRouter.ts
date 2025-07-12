import { Router } from '../common/Router.js'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { completeFrame, sidebarAndContent } from './viewInjector.js';

export class NavRouter extends Router {

	constructor(fastify: FastifyInstance, private db: DB) {
		super(fastify);
	}

	registerRoutes(): void {
		this.fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"]) {
				const output = completeFrame(this.db, "home", request.cookies.jwt);
				return reply.type("text/html").send(output);
			}
			else {
				const output = sidebarAndContent(this.db, "home", request.cookies.jwt);
				return reply.send(output);
			}
		});

		console.log("Registered view routes");
	}
}
