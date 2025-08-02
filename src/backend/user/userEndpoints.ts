import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUser, getUser, invalidateToken, loginUser, markUserOffline } from './userDB.js';
import * as OTPAuth from "otpauth";

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
				"Set-Cookie", `refreshToken=${payload.refreshToken}; expires=${refreshTokenDate}; Path=/; Secure; HttpOnly;`).send({
					message: "SUCCESS"
				});
	});

	fastify.post("/user/login", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = loginUser(db, JSON.parse(request.body as string));
		if (user.error) {
			const date = new Date();
			date.setDate(date.getDate() - 3);
			return reply.header(
				"Set-Cookie", `accessToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).header(
					"Set-Cookie", `refreshToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).send(user);
		}

		if (user.totpEnabled) {
			return reply.send({
				message: "SUCCESS",
				totpEnabled: true
			});
		}

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${user.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${user.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
					message: "SUCCESS",
					totpEnabled: false
				});
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

	fastify.post("/user/totp/check", async (request: FastifyRequest, reply: FastifyReply) => {
		const params = JSON.parse(request.body as string);
		const user = loginUser(db, params);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		let totp = new OTPAuth.TOTP({
			issuer: "Transcendence",
			label: user.email,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret: user.totpSecret,
		});

		if (null == totp.validate({ token: params.code, window: 1 })) {
			return reply.code(403).send({
				error: "ERR_BAD_TOTP"
			});
		}

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${user.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${user.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
					message: "SUCCESS"
				});
	});

	fastify.post("/user/leave", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.id)
			markUserOffline(db, user.id);
	});
}
