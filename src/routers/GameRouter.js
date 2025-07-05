var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from './Router.js';
import { GameController } from "../controllers/GameController.js";
export class GameRouter extends Router {
    constructor(fastify, db) {
        super(fastify);
        this.controller = new GameController(db);
    }
    registerRoutes() {
        this.fastify.get('/game', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            if (!request.headers["referer"])
                return this.addFrame(reply, "game");
            else
                return reply.view("game");
        }));
        this.fastify.get('/tournament', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            if (!request.headers["referer"])
                return this.addFrame(reply, "tournament");
            else
                return reply.view("tournament");
        }));
        console.log("Registered game routes");
    }
}
