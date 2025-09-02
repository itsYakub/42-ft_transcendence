import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as OTPAuth from "otpauth";
import nodemailer from 'nodemailer';
import { addTotpSecret, confirmAppTotp, disableTotp } from '../db/accountDb.js';
import encodeQR from 'qr';
import { Result } from '../../common/interfaces.js';

export function totpEndpoints(fastify: FastifyInstance): void {

	fastify.post("/api/totp/app", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
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

	fastify.post("/api/totp/email", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
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

	fastify.post("/api/totp/verify", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
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

	fastify.post("/api/totp/disable", async (request: FastifyRequest, reply: FastifyReply) => {
		const db = request.db;
		const user = request.user;
		return reply.send(disableTotp(db, user.userId));
	});
}
