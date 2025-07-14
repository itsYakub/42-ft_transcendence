import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { addUserToDB, loginUser } from '../db/userHandler.js';
import { navbarAndContent } from '../common/viewInjector.js';

export class UserRouter {

	constructor(private fastify: FastifyInstance, private db: DB) { }

	registerRoutes(): void {
		// this.fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
		// 	let user = this.controller.getFullUser(request.cookies.jwt);
		// 	let dest = user.error ? "login" : "profile";
		// 	if (!request.headers["referer"]) {
		// 		if (user.error)
		// 			return reply.redirect("/");
		// 		return this.addFrame(reply, dest, user);
		// 	}
		// 	else
		// 		return reply.view(dest, { user });
		// });

		// TODO Delete this!
		// this.fastify.get("/delete", async (request: FastifyRequest, reply: FastifyReply) => {
		// 	this.controller.deleteDB();
		// 	this.controller.setup();
		// 	let t = new Date();
		// 	t.setSeconds(t.getSeconds() + 10);
		// 	return reply.header(
		// 		"Set-Cookie", `jwt=blank; expires=${t}; Secure; HttpOnly;`).send("Deleted!");
		// });

		this.fastify.get("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
			const output = navbarAndContent(this.db, "home", "", {});
			let date = new Date();
			date.setDate(date.getDate() - 3);
			return reply.header(
				"Set-Cookie", `jwt=blank; expires=${date}; Secure; HttpOnly;`).send(output);
		});

		this.fastify.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
			const payload = addUserToDB(this.db, JSON.parse(request.body as string));
			let date = new Date();
			date.setDate(date.getDate() + 3);
			return reply.header(
				"Set-Cookie", `jwt=${payload.jwt}; expires=${date}; Secure; HttpOnly;`).send(payload);
		});

		this.fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
			const payload = loginUser(this.db, JSON.parse(request.body as string));
			if (payload.error) {
				let date = new Date();
				date.setDate(date.getDate() - 3);
				return reply.header(
					"Set-Cookie", `jwt=blank; expires=${date}; Secure; HttpOnly;`).send(payload);
			}
			let date = new Date();
			date.setDate(date.getDate() + 3);
			return reply.header(
				"Set-Cookie", `jwt=${payload.jwt}; expires=${date}; Secure; HttpOnly;`).send(payload);
		});

		console.log("Registered profile routes");
	}
}
