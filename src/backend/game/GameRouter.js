import { completeFrame, navbarAndContent } from '../common/viewInjector.js';
export class GameRouter {
    constructor(fastify, db) {
        this.fastify = fastify;
        this.db = db;
    }
    registerRoutes() {
        this.fastify.get('/game', async (request, reply) => {
            if (!request.headers["referer"]) {
                const output = completeFrame(this.db, "game", request.cookies.jwt, {});
                return reply.type("text/html").send(output);
            }
            else {
                const output = navbarAndContent(this.db, "game", request.cookies.jwt, {});
                return reply.send(output);
            }
        });
        this.fastify.get('/tournament', async (request, reply) => {
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
