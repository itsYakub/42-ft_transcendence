import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { addUser, getUser, invalidateToken, loginUser, markUserOffline } from './userDB.js';

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
}
