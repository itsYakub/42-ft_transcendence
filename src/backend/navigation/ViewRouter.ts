import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { frameAndContentHtml, frameHtml } from '../db/views/frame.js';

export class NavRouter {
	constructor(private fastify: FastifyInstance, private db: DB) { }

	registerRoutes(): void {
		this.fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
			let user = this.db.getUser(request.cookies.jwt);

			if (!request.headers["referer"]) {
				let frame = frameHtml(this.db, "home", user);
				return reply.type("text/html").send(frame);
			}

			let frame = frameAndContentHtml(this.db, "home", user);
			return reply.send(frame);
		});

		this.fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
			let user = this.db.getUser(request.cookies.jwt);
			if (user.error) {
				return reply.redirect("/");
			}

			if (!request.headers["referer"]) {
				let frame = frameHtml(this.db, "profile", user);
				return reply.type("text/html").send(frame);
			}
			else {
				let frame = frameAndContentHtml(this.db, "profile", user);
				return reply.send(frame);
			}
		});

		console.log("Registered view routes");
	}
}
