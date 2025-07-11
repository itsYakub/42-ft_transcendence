import { Router } from '../common/Router.js'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ViewController } from './ViewController.js';
import { DatabaseSync } from 'node:sqlite';

export class NavRouter extends Router {
	private controller: ViewController;

	constructor(fastify: FastifyInstance, db: DatabaseSync) {
		super(fastify);
		this.controller = new ViewController(db);
	}

	registerRoutes(): void {
		this.fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"]) {
				let user = this.controller.getUser(request.cookies.jwt);
				return this.addFrame(reply, "home", user);
			}
			else
				return reply.view("home");
		});

		console.log("Registered view routes");
	}
}
