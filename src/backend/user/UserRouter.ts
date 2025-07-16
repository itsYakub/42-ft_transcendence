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
			let date = new Date();
			date.setDate(date.getDate() - 3);
			return reply.header(
				"Set-Cookie", `jwt=blank; expires=${date}; Secure; HttpOnly;`).redirect("/");
		});

		/* Google sign-in redirects to here */
		this.fastify.get("/auth/google", async (request: FastifyRequest, reply: FastifyReply) => {
			let code: string = request.query["code"];

			// add checks

			const dd = {
				"client_id": process.env.GOOGLE_CLIENT,
				"client_secret": process.env.GOOGLE_SECRET,
				"code": code,
				"grant_type": "authorization_code",
				"redirect_uri": "http://localhost:3000/auth/google"
			}

			const response = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				body: JSON.stringify(dd)
			});

			console.log(response);
			const json = await response.json();
			console.log(json);
			const idToken: string = json.id_token;
			const payload = idToken.split(".")[1];
			const decoded: string = atob(payload);
			const user = JSON.parse(decoded);
			console.log(user.name);
			console.log(user.picture);
			console.log(user.email);

			// add to db

			return reply.redirect("/");
		});

		console.log("Registered profile routes");
	}
}
