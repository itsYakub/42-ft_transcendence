import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { updateAvatar, updateNick, updatePassword } from '../db/accountDb.js';
import { invalidateToken, removeUserFromMatch } from '../db/userDB.js';

export function accountEndpoints(fastify: FastifyInstance): void {

	fastify.post('/api/account/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		const { avatar, type } = request.body as any;
		return reply.send(updateAvatar(db, avatar, type, user.userId));
	});

	fastify.post('/api/account/nick', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		const { newNick } = request.body as any;
		return (reply.send(updateNick(db, newNick, user.userId)));
	});

	fastify.post('/api/account/password', async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		const { checkPassword, newPassword } = request.body as any;
		return reply.send(updatePassword(db, checkPassword, newPassword, user));

	});

	//TODO no redirecting!
	fastify.post("/api/account/invalidate-token", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;

		invalidateToken(db, user.userId);
		removeUserFromMatch(db, user.userId);
		const date = "Thu, 01 Jan 1970 00:00:00 UTC";
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});

	fastify.get("/api/account/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		removeUserFromMatch(db, request.user.userId);
		const date = "Thu, 01 Jan 1970 00:00:00 UTC";
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});
}
