import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DB } from '../db/db.js';
import { addUserToDB, loginUser, updateAvatar, updateNick, updatePassword } from './userHandler.js';

export function userEndpoints(fastify: FastifyInstance, db: DB): void {
	// TODO Delete this!
	fastify.get("/delete", async (request: FastifyRequest, reply: FastifyReply) => {
		db.initDB(true, true, true);
		return reply.redirect("/user/logout");
	});

	fastify.post("/user/register", async (request: FastifyRequest, reply: FastifyReply) => {
		const payload = addUserToDB(db, JSON.parse(request.body as string));
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
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.send(user);
		}
		db.invalidateToken(user);
		const date = new Date();
		date.setDate(date.getDate() - 3);
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});

	fastify.get("/user/logout2", async (request: FastifyRequest, reply: FastifyReply) => {
		//this.db.logoutUser(request.cookies.jwt);
	});

	fastify.post('/user/password', async (request: FastifyRequest, reply: FastifyReply) => {
		const fullUser: boolean = true;
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken, fullUser);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const response = updatePassword(db, user, JSON.parse(request.body as string));
		if (response.error) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});

	fastify.post('/user/nick', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const response = updateNick(db, user.id, JSON.parse(request.body as string).nick);
		if (response.error) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});

	fastify.post('/user/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = db.getUser(request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const response = updateAvatar(db, user.id, JSON.parse(request.body as string).avatar);
		if (response.error) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});
}
