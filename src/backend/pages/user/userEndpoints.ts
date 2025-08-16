import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addGuest, addUser, getUser, invalidateToken, loginUser, markUserOffline, markUserOffline2, markUserOnline } from './userDB.js';
import * as OTPAuth from "otpauth";

export function userEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.post("/user/register", async (request: FastifyRequest, reply: FastifyReply) => {
		const json = JSON.parse(request.body as string);

		const response = addUser(db, json);
		if (response.error)
			return reply.send(response);

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${response.accessToken}; expires=${accessTokenDate}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${response.refreshToken}; expires=${refreshTokenDate}; Path=/; Secure; HttpOnly;`).send({
					code: 200,
					message: "SUCCESS"
				});
	});

	fastify.post("/guest/register", async (request: FastifyRequest, reply: FastifyReply) => {
		const response = addGuest(db);
		if (response.error)
			return reply.send(response);

		return reply.header(
			"Set-Cookie", `accessToken=${response.accessToken}; Path=/; Secure; HttpOnly;`).send({
				code: 200,
				message: "SUCCESS"
			});
	});

	fastify.post("/user/login", async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = loginUser(db, JSON.parse(request.body as string));
		if (200 != userResponse.code) {
			const date = new Date();
			date.setDate(date.getDate() - 3);
			return reply.header(
				"Set-Cookie", `accessToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).header(
					"Set-Cookie", `refreshToken=blank; Path=/; expires=${date}; Secure; HttpOnly;`).send(userResponse);
		}

		if (userResponse.user.totpEnabled) {
			return reply.send({
				code: 200,
				message: "SUCCESS",
				totpEnabled: true
			});
		}

		const accessTokenDate = new Date();
		accessTokenDate.setSeconds(accessTokenDate.getSeconds() + 5);
		const refreshTokenDate = new Date();
		refreshTokenDate.setFullYear(refreshTokenDate.getFullYear() + 1);
		return reply.header(
			"Set-Cookie", `accessToken=${userResponse.accessToken}; Path=/; expires=${accessTokenDate}; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=${userResponse.refreshToken}; Path=/; expires=${refreshTokenDate}; Secure; HttpOnly;`).send({
					code: 200,
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
		if (user.error)
			return reply.send(user);

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
				code: 403,
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
					code: 200,
					message: "SUCCESS"
				});
	});

	fastify.post("/user/join", async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 == userResponse.code)
			markUserOnline(db, userResponse.user);
	});

	fastify.post("/user/leave", async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 == userResponse.code)
			markUserOffline(db, userResponse.user);
	});

	fastify.post("/user/leave-room", async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 == userResponse.code)
			markUserOffline2(db, userResponse.user);
	});

	fastify.get("/user/id", async (request: FastifyRequest, reply: FastifyReply) => {
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.send(userResponse);

		return reply.send({
			code: 200,
			id: userResponse.user.id,
			nick: userResponse.user.nick,
			online: userResponse.user.online
		});
	});
}
