import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addGoogleUser } from './userDB.js';

export function googleAuth(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get("/auth/google", async (request: FastifyRequest, reply: FastifyReply) => {
		const code: string = request.query["code"];

		const params = {
			client_id: process.env.GOOGLE_CLIENT,
			client_secret: process.env.GOOGLE_SECRET,
			code: code,
			grant_type: "authorization_code",
			redirect_uri: process.env.GOOGLE_REDIRECT
		}

		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			body: JSON.stringify(params)
		});

		if (200 != response.status) {
			return reply.header(
				"Set-Cookie", `googleautherror=true; Domain=localhost; Path=/;`).redirect("/");
		}

		const json = await response.json();
		const idToken: string = json.id_token;
		const googlePayload = idToken.split(".")[1];
		const decoded: string = atob(googlePayload);
		const user = JSON.parse(decoded);
		const avatar = await convertFile(user.picture);

		const userJSON = {
			nick: user.name,
			email: user.email,
			avatar: avatar,
			online: 1
		}

		const payload = addGoogleUser(db, userJSON);
		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${payload.accessToken}; Domain=localhost; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${payload.refreshToken}; Domain=localhost; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).redirect("/");
	});

	/* Converts the image blob into base64 */
	async function convertFile(avatarURL: string): Promise<string> {
		const response = await fetch(avatarURL);
		const img = await response.blob();
		const buffer = Buffer.from(await img.arrayBuffer());
		const converted = "data:" + img.type + ';base64,' + buffer.toString('base64');
		return converted;
	}
}
