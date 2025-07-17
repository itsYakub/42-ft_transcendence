import { frameAndContentHtml, frameHtml } from '../db/views/frame.js';
export class GameRouter {
    constructor(fastify, db) {
        this.fastify = fastify;
        this.db = db;
    }
    registerRoutes() {
        this.fastify.get('/play', async (request, reply) => {
            let user = this.db.getUser(request.cookies.jwt);
            if (!request.headers["referer"]) {
                let frame = frameHtml(this.db, "play", user);
                return reply.type("text/html").send(frame);
            }
            let frame = frameAndContentHtml(this.db, "play", user);
            return reply.send(frame);
        });
        this.fastify.get('/tournament', async (request, reply) => {
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
