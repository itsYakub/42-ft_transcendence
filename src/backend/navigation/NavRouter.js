import { Router } from '../common/Router.js';
export class NavRouter extends Router {
    registerRoutes() {
        this.fastify.get('/', async (request, reply) => {
            if (!request.headers["referer"])
                return this.addFrame(reply, "home");
            else
                return reply.view("home");
        });
        console.log("Registered nav routes");
    }
}
