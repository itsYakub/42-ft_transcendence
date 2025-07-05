import { Router } from './Router.js'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from 'node:sqlite';
import { UserController } from "../controllers/UserController.js";

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
		console.log("Registered profile routes");
	}
}

// 	// Return all registered users from the db
// 	// fastify.get('/users', async (request, reply) => {
// 	// 	let internal = request.headers["internal"];
// 	// 	const users = db.conn.prepare("SELECT * FROM users").all();
// 	// 	var ttt = await reply.viewAsync("users", { title: "All users", users });
// 	// 	if (internal === "true") {
// 	// 		console.log("internal");
// 	// 		return ttt;
// 	// 	}
// 	// 	else {
// 	// 		console.log("external");
// 	// 		return reply.viewAsync("index", { title: "Homepage", ttt: false, content: ttt });
// 	// 	}
// 	// });

// 	// // Return one user
// 	// fastify.get('/users/:id', async (request, reply) => {
// 	// 	const { id } = request.params;
// 	// 	const user = db.conn.prepare("SELECT * FROM users WHERE id = ?").get(id);
// 	// 	if (!user) {
// 	// 		return reply.status(404).send({ error: "User not found" });
// 	// 	}

// 	// 	return reply.viewAsync("user", { title: user.nick, user });
// 	// });
