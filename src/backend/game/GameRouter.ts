import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { DB } from '../db/db.js';
import { completeFrame, navbarAndContent } from '../common/viewInjector.js';

export class GameRouter {
	constructor(private fastify: FastifyInstance, private db: DB) { }

	registerRoutes(): void {
		this.fastify.get('/game', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"]) {
				const output = completeFrame(this.db, "game", request.cookies.jwt, {});
				return reply.type("text/html").send(output);
			}
			else {
				const output = navbarAndContent(this.db, "game", request.cookies.jwt, {});
				return reply.send(output);
			}
		});

		this.fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"]) {
				const output = completeFrame(this.db, "tournament", request.cookies.jwt, {});
				return reply.type("text/html").send(output);
			}
			else {
				const output = navbarAndContent(this.db, "tournament", request.cookies.jwt, {});
				return reply.send(output);
			}
		});

		console.log("Registered game routes");
	}
}
