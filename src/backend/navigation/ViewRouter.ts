import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { completeFrame, navbarAndContent } from '../common/viewInjector.js';

export class NavRouter {

	constructor(private fastify: FastifyInstance, private db: DB) {}

	registerRoutes(): void {
		this.fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"]) {
				const output = completeFrame(this.db, "home", request.cookies.jwt);
				return reply.type("text/html").send(output);
			}
			else {
				const output = navbarAndContent(this.db, "home", request.cookies.jwt);
				return reply.send(output);
			}
		});

		console.log("Registered view routes");
	}
}
