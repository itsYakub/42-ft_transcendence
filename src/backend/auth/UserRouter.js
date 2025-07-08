import { Router } from '../navigation/Router.js';
import { UserController } from "./UserController.js";
export class UserRouter extends Router {
    constructor(fastify, db) {
        super(fastify);
        this.controller = new UserController(db);
    }
    registerRoutes() {
        this.fastify.get('/register', async (request, reply) => {
            if (!request.headers["referer"])
                return this.addFrame(reply, "register");
            else
                return reply.view("register");
        });
        this.fastify.get('/login', async (request, reply) => {
            if (!request.headers["referer"])
                return this.addFrame(reply, "login");
            else
                return reply.view("login");
        });
        this.fastify.post("/register", async (request, reply) => {
            this.controller.addUser(JSON.parse(request.body));
        });
        console.log("Registered profile routes");
    }
}
