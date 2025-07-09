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
			if (!request.headers["referer"])
				return this.addFrame(reply, "register");
			else
				return reply.view("register");
		});
		this.fastify.get('/login', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"])
				return this.addFrame(reply, "login");
			else
				return reply.view("login");
		});

		this.fastify.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
			const jwt = this.controller.addUser(JSON.parse(request.body as string));
			return reply.send(jwt);
		});

		this.fastify.get("/user", async (request: FastifyRequest, reply: FastifyReply) => {
			const user = this.controller.getUser(request.cookies.jwt);
			return reply.send(user);
		});
		console.log("Registered profile routes");
	}
}
