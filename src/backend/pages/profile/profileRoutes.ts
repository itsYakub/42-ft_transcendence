import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameHtml } from '../frameHtml.js';
import { getUser } from '../user/userDB.js';
import { addTOTPSecret, confirmTOTP, removeTOTPSecret, updateAvatar, updateNick, updatePassword } from './profileDB.js';
import * as OTPAuth from "otpauth";
import encodeQR from 'qr';
import { profileHtml } from './profileHtml.js';
import { noUserError } from '../home/homeRoutes.js';

export function profileRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
		const language = request.cookies.language ?? "english";
		const userResponse = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (200 != userResponse.code)
			return reply.type("text/html").send(noUserError(userResponse, language));

		const params = {
			user: userResponse.user,
			language
		};
		const html = profileHtml(params);

		const frame = frameHtml(params, html);
		return reply.type("text/html").send(frame);
	});

	fastify.post('/profile/nick', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.send(user);

		const params = JSON.parse(request.body as string);
		params["id"] = user.id;

		const response = updateNick(db, params);
		return reply.send(response);
	});

	fastify.post('/profile/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.send(user);

		const params = JSON.parse(request.body as string);
		params["id"] = user.id;

		const response = updateAvatar(db, params);
		return reply.send(response);
	});

	fastify.post('/profile/password', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.send(user);

		const params = JSON.parse(request.body as string);
		params["id"] = user.id;
		params["password"] = user.password;

		const response = updatePassword(db, params);
		return reply.send(response);
	});

	fastify.post("/profile/totp/enable", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.code(user.code).send(user);

		const secret = new OTPAuth.Secret({ size: 20 });
		addTOTPSecret(db, {
			id: user.id,
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

	fastify.post("/profile/totp/disable", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error)
			return reply.send(user);

		const response = removeTOTPSecret(db, user.id);
		reply.send(response);
	});

	fastify.post("/profile/totp/verify", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
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

		const params = JSON.parse(request.body as string);
		if (null != totp.validate({ token: params.code, window: 1 })) {
			confirmTOTP(db, user.id);
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
}
