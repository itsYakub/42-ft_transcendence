import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import * as OTPAuth from "otpauth";
import nodemailer from 'nodemailer';
import { addTotpSecret, confirmAppTotp, disableTotp, updateAvatar, updateNick, updatePassword } from '../db/accountDb.js';
import encodeQR from 'qr';
import { invalidateToken, removeUserFromMatch } from '../db/userDB.js';
import { Result } from '../../common/interfaces.js';

export function accountEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {

	fastify.post('/api/account/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const { avatar, type } = request.body as any;
		return reply.send(updateAvatar(db, avatar, type, user.userId));
	});

	fastify.post('/api/account/nick', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const { newNick } = request.body as any;
		return (reply.send(updateNick(db, newNick, user.userId)));
	});

	fastify.post('/api/account/password', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const { checkPassword, newPassword } = request.body as any;
		return reply.send(updatePassword(db, checkPassword, newPassword, user));

	});

	fastify.post("/api/account/app-totp", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const secret = new OTPAuth.Secret({ size: 20 });
		const result = addTotpSecret(db, secret.base32, user.userId);
		if (Result.SUCCESS != result)
			return {
				result
			};

		let totp = new OTPAuth.TOTP({
			issuer: "Transcendence",
			label: user.email,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret: secret,
		});

		const response = {
			secret: secret.base32,
			qrcode: encodeQR(totp.toString(), 'svg'),
		}

		reply.send({
			result: Result.SUCCESS,
			contents: response
		});
	});

	fastify.post("/api/account/email-totp", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
//change email!
		const secret = Math.floor(100000 + Math.random() * 900000).toString();
		const result = addTotpSecret(db, secret, user.userId);
		if (Result.SUCCESS != result)
			return result;

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'transcen42dence@gmail.com',
				pass: 'bbzo uhrv uycr cida'
			}
		});

		//translate, make two versions
		const text = `${secret}`;

		let mailOptions = {
			host: "smtp.gmail.com",
			port: 587,
			tls: {
				rejectUnauthorized: true,
				minVersion: "TLSv1.2"
			},
			from: '"Transcendence Team" <transcen42dence@gmail.com>',
			to: 'coldandtired@gmail.com',
			subject: 'Transcendence TOTP',
			text,
			html: `<b>${secret}</b>`
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error)
				reply.send(Result.ERR_DB);
			else
				reply.send(Result.SUCCESS);
		});
	});

	fastify.post("/api/account/verify-totp", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		let totp = new OTPAuth.TOTP({
			issuer: "Transcendence",
			label: user.email,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret: user.totpSecret,
		});

		const params = request.body as any;

		console.log("params", params);

		console.log("totp", totp.validate({ token: params.code, window: 1 }));

		if (null != totp.validate({ token: params.code, window: 1 })) {
			confirmAppTotp(db, user.userId);
			return reply.send(Result.SUCCESS);
		}

		return reply.send(Result.ERR_BAD_TOTP);
	});

	fastify.post("/api/account/disable-totp", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		return reply.send(disableTotp(db, user.userId));
	});
//TODO no redirecting!
	fastify.post("/api/account/invalidate-token", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		invalidateToken(db, user.userId);
		removeUserFromMatch(db, user.userId);
		const date = "Thu, 01 Jan 1970 00:00:00 UTC";
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});

	fastify.get("/api/account/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		removeUserFromMatch(db, request.user.userId);
		const date = "Thu, 01 Jan 1970 00:00:00 UTC";
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});
}
