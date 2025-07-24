import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUser, getUser, invalidateToken, loginUser, markUserOffline } from './userDB.js';
import * as OTPAuth from "otpauth";
import encodeQR from 'qr';

export function userEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/user/register", async (request: FastifyRequest, reply: FastifyReply) => {
		const json = JSON.parse(request.body as string);
		json["online"] = 1;

		const payload = addUser(db, json);
		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${payload.accessToken}; expires=${accessTokenDate}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${payload.refreshToken}; expires=${refreshTokenDate}; Path=/; Secure; HttpOnly;`).send(payload);
	});

	fastify.post("/user/login", async (request: FastifyRequest, reply: FastifyReply) => {
		const payload = loginUser(db, JSON.parse(request.body as string));
		if (payload.error) {
			const date = new Date();
			date.setDate(date.getDate() - 3);
			return reply.header(
				"Set-Cookie", `accessToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).header(
					"Set-Cookie", `refreshToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).send(payload);
		}
		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${payload.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${payload.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send(payload);
	});

	fastify.get("/user/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		const date = new Date();
		date.setDate(date.getDate() - 3);
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});

	fastify.post("/user/invalidate-token", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.send(user);
		}
		invalidateToken(db, user);
		const date = new Date();
		date.setDate(date.getDate() - 3);
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});

	fastify.post("/user/leave", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.id)
			markUserOffline(db, user.id);
	});

	fastify.get("/user/2fa", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.send(user);
		}

		let totp = new OTPAuth.TOTP({
			issuer: "Transcendence",
			label: user.email,
			algorithm: "SHA256",
			digits: 6,
			period: 30,
			secret: new OTPAuth.Secret({ size: 20 }),
		});

		// Generate a token (returns the current token as a string).
		let token = totp.generate();

		// Validate a token (returns the token delta or null if it is not found in the
		// search window, in which case it should be considered invalid).
		//
		// A search window is useful to account for clock drift between the client and
		// server; however, it should be kept as small as possible to prevent brute
		// force attacks. In most cases, a value of 1 is sufficient. Furthermore, it is
		// essential to implement a throttling mechanism on the server.

		let delta = totp.validate({ token, window: 1 });
		const svgElement = encodeQR(totp.toString(), 'svg');
		reply.send(svgElement);
	});
}
