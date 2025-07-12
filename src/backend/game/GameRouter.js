import { Router } from '../common/Router.js';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from 'node:sqlite';
import { GameController } from "./GameController.js";
export class GameRouter extends Router {
    controller;
    constructor(fastify, db) {
        super(fastify);
        this.controller = new GameController(db);
    }
    registerRoutes() {
        this.fastify.get('/game', async (request, reply) => {
            if (!request.headers["referer"])
                return this.addFrame(reply, "game", {});
            else
                return reply.view("game");
        });
        this.fastify.get('/tournament', async (request, reply) => {
            if (!request.headers["referer"])
                return this.addFrame(reply, "tournament", {});
            else
                return reply.view("tournament");
        });
        console.log("Registered game routes");
    }
}
