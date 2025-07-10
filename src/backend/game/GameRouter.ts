import { Router } from '../common/Router.js'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { DatabaseSync } from 'node:sqlite';
import { GameController } from "./GameController.js";

export class GameRouter extends Router {
	private controller: GameController;

	constructor(fastify: FastifyInstance, db: DatabaseSync) {
		super(fastify);
		this.controller = new GameController(db);
	}

	registerRoutes(): void {
		this.fastify.get('/game', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"])
				return this.addFrame(reply, "game", {});
			else
				return reply.view("game");
		});

		this.fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
			if (!request.headers["referer"])
				return this.addFrame(reply, "tournament", {});
			else
				return reply.view("tournament");
		});
		
		console.log("Registered game routes");
	}
}
