import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { DB } from '../db/db.js';
import { frameAndContentHtml, frameHtml } from '../db/views/frame.js';

export class GameRouter {
	constructor(private fastify: FastifyInstance, private db: DB) { }

	registerRoutes(): void {
		this.fastify.get('/play', async (request: FastifyRequest, reply: FastifyReply) => {
			let user = this.db.getUser(request.cookies.jwt);

			if (!request.headers["referer"]) {
				let frame = frameHtml(this.db, "play", user);
				return reply.type("text/html").send(frame);
			}

			let frame = frameAndContentHtml(this.db, "play", user);
			return reply.send(frame);
		});

		this.fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
			let user = this.db.getUser(request.cookies.jwt);

			if (!request.headers["referer"]) {
				let frame = frameHtml(this.db, "tournament", user);
				return reply.type("text/html").send(frame);
			}

			let frame = frameAndContentHtml(this.db, "tournament", user);
			return reply.send(frame);
		});
	}
}
