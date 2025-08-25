import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import * as OTPAuth from "otpauth";
import { addGoogleUser, addGuest, loginUser } from '../db/userDB.js';
import { Result } from '../../common/interfaces.js';

export function authEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/api/auth/check-totp", async (request: FastifyRequest, reply: FastifyReply) => {
		const params = request.body as any;
		const userBox = loginUser(db, params);
		if (Result.SUCCESS != userBox.result)
			return reply.send(userBox);

		const user = userBox.user;

		let totp = new OTPAuth.TOTP({
			issuer: "Transcendence",
			label: user.email,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret: user.totpSecret,
		});

		if (null == totp.validate({ token: params.code, window: 1 })) {
			return reply.send({
				result: "ERR_BAD_TOTP"
			});
		}

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${userBox.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${userBox.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
					result: Result.SUCCESS
				});
	});

	fastify.post("/api/guest/register", async (request: FastifyRequest, reply: FastifyReply) => {
		const guestBox = addGuest(db);
		if (Result.SUCCESS != guestBox.result)
			return reply.send(guestBox);

		return reply.header(
			"Set-Cookie", `accessToken=${guestBox.contents}; Path=/; Secure; HttpOnly;`).send(Result.SUCCESS);
	});

	fastify.get("/auth/google", async (request: FastifyRequest, reply: FastifyReply) => {
		const code: string = request.query["code"];

		const redirectUrl = (`https://${request.host}:3000/auth/google`);

		const params = {
			client_id: process.env.GOOGLE_CLIENT,
			client_secret: process.env.GOOGLE_SECRET,
			code: code,
			grant_type: "authorization_code",
			redirect_uri: redirectUrl
		}

		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(params)
		});

		if (200 != response.status) {
			return reply.header("Set-Cookie", `googleautherror=true; Path=/;`).redirect("/");
		}

		const json = await response.json();
		const idToken: string = json.id_token;
		const googlePayload = idToken.split(".")[1];
		const decoded: string = atob(googlePayload);
		const user = JSON.parse(decoded);
		const avatar = await convertFile(user.picture);

		const userJSON = {
			email: user.email,
			avatar: avatar,
		}

		const payload = addGoogleUser(db, userJSON);
		if (Result.SUCCESS != payload.result)
			return reply.header("Set-Cookie", `googleautherror=true; Path=/;`).redirect("/");

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${payload.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${payload.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).redirect("/");
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
