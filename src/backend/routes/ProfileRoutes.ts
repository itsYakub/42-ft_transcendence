import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { frameAndContentHtml, frameHtml } from '../db/handlers/frame.js';
import { updateAvatar, updateNick } from '../db/handlers/userHandler.js';

export class ProfileRouter {
	constructor(private fastify: FastifyInstance, private db: DB) { }

	registerRoutes(): void {
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

		this.fastify.get('/matches', async (request: FastifyRequest, reply: FastifyReply) => {
			let user = this.db.getUser(request.cookies.jwt);
			if (user.error) {
				return reply.redirect("/");
			}

			if (!request.headers["referer"]) {
				let frame = frameHtml(this.db, "matches", user);
				return reply.type("text/html").send(frame);
			}
			else {
				let frame = frameAndContentHtml(this.db, "matches", user);
				return reply.send(frame);
			}
		});

		this.fastify.get('/friends', async (request: FastifyRequest, reply: FastifyReply) => {
			let user = this.db.getUser(request.cookies.jwt);
			if (user.error) {
				return reply.redirect("/");
			}

			if (!request.headers["referer"]) {
				let frame = frameHtml(this.db, "friends", user);
				return reply.type("text/html").send(frame);
			}
			else {
				let frame = frameAndContentHtml(this.db, "friends", user);
				return reply.send(frame);
			}
		});

		this.fastify.post('/nick', async (request: FastifyRequest, reply: FastifyReply) => {
			updateNick(this.db, JSON.parse(request.body as string));
			reply.code(200);
		});

		this.fastify.post('/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
			updateAvatar(this.db, JSON.parse(request.body as string));
			reply.code(200);
		});
	}
}
