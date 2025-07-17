import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { addGoogleUserToDB } from '../db/userHandler.js';

export class GoogleRouter {
	constructor(private fastify: FastifyInstance, private db: DB) { }

	registerRoutes(): void {
		/* Google sign-in redirects to here */
		this.fastify.get("/auth/google", async (request: FastifyRequest, reply: FastifyReply) => {
			let code: string = request.query["code"];

			const params = {
				"client_id": process.env.GOOGLE_CLIENT,
				"client_secret": process.env.GOOGLE_SECRET,
				"code": code,
				"grant_type": "authorization_code",
				"redirect_uri": process.env.GOOGLE_REDIRECT
			}

			const response = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				body: JSON.stringify(params)
			});

			if (200 != response.status) {
				return reply.redirect("/");
				//let frame = frameHtml(this.db, "error", { error: true, message: "Couldn't log in" });
				//return reply.type("text/html").send(frame);
			}

			const json = await response.json();
			const idToken: string = json.id_token;
			const googlePayload = idToken.split(".")[1];
			const decoded: string = atob(googlePayload);
			const user = JSON.parse(decoded);
			const avatar = await this.convertFile(user.picture);

			const userJSON = {
				"nick": user.name,
				"email": user.email,
				"avatar": avatar
			}

			const payload = addGoogleUserToDB(this.db, userJSON);
			let date = new Date();
			date.setDate(date.getDate() + 3);
			return reply.header(
				"Set-Cookie", `jwt=${payload.jwt}; Domain=localhost; Path=/; expires=${date}; Secure; HttpOnly;`).redirect("/");
		});		
	}

	/* Converts the image blob into base64 */
	async convertFile(avatarURL: string): Promise<string> {
		const response = await fetch(avatarURL);
		const img = await response.blob();
		const buffer = Buffer.from(await img.arrayBuffer());
		const converted = "data:" + img.type + ';base64,' + buffer.toString('base64');
		return converted;
	}
}
