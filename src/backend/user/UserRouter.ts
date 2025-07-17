import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { addUserToDB, loginUser } from '../db/userHandler.js';

export class UserRouter {
	constructor(private fastify: FastifyInstance, private db: DB) { }

	registerRoutes(): void {		
		// TODO Delete this!
		this.fastify.get("/delete", async (request: FastifyRequest, reply: FastifyReply) => {
			this.db.initDB(true, true, true);
			return reply.redirect("/logout");
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

		this.fastify.get("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
			this.db.logoutUser(request.cookies.jwt);
			let date = new Date();
			date.setDate(date.getDate() - 3);
			return reply.header(
				"Set-Cookie", `jwt=blank; expires=${date}; Secure; HttpOnly;`).redirect("/");
		});



		this.fastify.get("/logout2", async (request: FastifyRequest, reply: FastifyReply) => {
			//this.db.logoutUser(request.cookies.jwt);
		});
	}
}
