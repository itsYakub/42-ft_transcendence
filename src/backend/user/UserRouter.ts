import { Router } from '../common/Router.js'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from 'node:sqlite';
import { UserController } from "./UserController.js";

export class UserRouter extends Router {
	private controller: UserController;

	constructor(fastify: FastifyInstance, db: DatabaseSync) {
		super(fastify);
		this.controller = new UserController(db);
	}

	registerRoutes(): void {
		this.fastify.get('/register', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"]) {
				let user = this.controller.getUser(request.cookies.jwt);
				let dest = user.error ? "register" : "home";
				if (!user.error)
					return reply.redirect("/");
				return this.addFrame(reply, dest, user);
			}
			else
				return reply.view("register");
		});

		this.fastify.get('/login', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"]) {
				let user = this.controller.getUser(request.cookies.jwt);
				let dest = user.error ? "login" : "home";
				if (!user.error)
					return reply.redirect("/");
				return this.addFrame(reply, dest, user);
			}
			else
				return reply.view("login");
		});

		this.fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
			let user = this.controller.getFullUser(request.cookies.jwt);
			let dest = user.error ? "home" : "profile";
			if (!request.headers["referer"]) {
				if (user.error)
					return reply.redirect("/");
				return this.addFrame(reply, dest, user);
			}
			else
				return reply.view("profile", { user });
		});



		this.fastify.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
			const payload = this.controller.addUser(JSON.parse(request.body as string));
			let date = new Date();
			date.setDate(date.getDate() + 3);
			return reply.header(
				"Set-Cookie", `jwt=${payload.jwt}; expires=${date}; Secure; HttpOnly;`).send(payload);
		});

		this.fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
			const payload = this.controller.loginUser(JSON.parse(request.body as string));
			let date = new Date();
			date.setDate(date.getDate() + 3);
			return reply.header(
				"Set-Cookie", `jwt=${payload.jwt}; expires=${date}; Secure; HttpOnly;`).send(payload);
		});

		console.log("Registered profile routes");
	}
}
