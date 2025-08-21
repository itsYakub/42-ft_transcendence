import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import * as OTPAuth from "otpauth";
//import nodemailer from 'nodemailer';
import { addTOTPSecret, confirmTOTP, removeTOTPSecret, updateAvatar, updateNick, updatePassword } from '../db/accountDB.js';
import encodeQR from 'qr';
import { invalidateToken } from '../db/userDB.js';

export function accountEndpoints(fastify: FastifyInstance, db: DatabaseSync): void {

	fastify.post('/account/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		if (!user)
			return reply.send(false);

		const params = request.body as any;
		params["id"] = user.userId;

		return reply.send(updateAvatar(db, params));
	});

	fastify.post('/account/nick', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		if (!user)
			return reply.send(false);

		const params = request.body as any;
		params["id"] = user.userId;


		// let transporter = nodemailer.createTransport({
		// 			service: 'gmail',
		// 			auth: {
		// 				user: 'transcen42dence@gmail.com',
		// 				pass: 'khsh gyex hcrc rxle'
		// 			}
		// 		});

		// 		let mailOptions = {
		// 			host: "smtp.gmail.com",
		// 			port: 587,
		// 			tls: {
		// 				rejectUnauthorized: true,
		// 				minVersion: "TLSv1.2"
		// 			},
		// 			from: 'transcen42dence@gmail.com',
		// 			to: 'coldandtired@gmail.com',
		// 			subject: 'Sending Email using Node.js',
		// 			text: 'That was easy!'
		// 		};

		// transporter.sendMail(mailOptions, function (error, info) {
		// 	if (error) {
		// 		console.log(error);
		// 	} else {
		// 		console.log('Email sent: ' + info.response);
		// 	}
		// });


		return (reply.send(updateNick(db, params)));
	});

	fastify.post('/account/password', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		if (!user)
			return reply.send({
				code: 403
			});

		const params = request.body as any;
		params["id"] = user.userId;
		params["currentPassword"] = user.password;

		return reply.send(updatePassword(db, params));

	});

	fastify.post("/account/enable-totp", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		const secret = new OTPAuth.Secret({ size: 20 });
		addTOTPSecret(db, {
			id: user.userId,
			secret: secret.base32
		});

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

		// let transporter = nodemailer.createTransport({
		// 	service: 'gmail',
		// 	auth: {
		// 		user: 'transcen42dence@gmail.com',
		// 		pass: 'khsh gyex hcrc rxle'
		// 	}
		// });

		// let mailOptions = {
		// 	host: "smtp.gmail.com",
		// 	port: 587,
		// 	tls: {
		// 		rejectUnauthorized: true,
		// 		minVersion: "TLSv1.2"
		// 	},
		// 	from: 'transcen42dence@gmail.com',
		// 	to: 'coldandtired@gmail.com',
		// 	subject: 'Sending Email using Node.js',
		// 	text: 'That was easy!'
		// };

		// transporter.sendMail(mailOptions, function (error, info) {
		// 	if (error) {
		// 		console.log(error);
		// 	} else {
		// 		console.log('Email sent: ' + info.response);
		// 	}
		// });

		reply.send(response);
	});

	fastify.post("/account/verify-totp", async (request: FastifyRequest, reply: FastifyReply) => {
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
		if (null != totp.validate({ token: params.code, window: 1 })) {
			confirmTOTP(db, user.userId);
			return reply.send({
				code: 200,
				message: "SUCCESS"
			});
		}

		return reply.send({
			code: 403,
			error: "ERR_BAD_TOTP"
		});
	});

	fastify.post("/account/disable-totp", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		if (!user)
			return reply.send(false);

		return reply.send(removeTOTPSecret(db, user.userId));
	});

	fastify.post("/account/invalidate-token", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;

		if (!user)
			return;

		invalidateToken(db, user);
		const date = new Date();
		date.setDate(date.getDate() - 3);
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});

	fastify.get("/account/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		const date = new Date();
		date.setDate(date.getDate() - 3);
		return reply.header(
			"Set-Cookie", `accessToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).header(
				"Set-Cookie", `refreshToken=blank; expires=${date}; Path=/; Secure; HttpOnly;`).redirect("/");
	});
}
