import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as OTPAuth from "otpauth";
import nodemailer from 'nodemailer';
import { addTotpSecret, confirmAppTotp, disableTotpDb } from '../db/accountDb.js';
import encodeQR from 'qr';
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';

export async function addTotpApp(request: FastifyRequest, reply: FastifyReply) {
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
}

export function addTotpEmail(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

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

	const text = translate(request.language, "%%MESSAGE_TOTP%%");

	let mailOptions = {
		host: "smtp.gmail.com",
		port: 587,
		tls: {
			rejectUnauthorized: true,
			minVersion: "TLSv1.2"
		},
		from: '"Transcendence Team" <transcen42dence@gmail.com>',
		to: user.email,
		subject: 'Transcendence TOTP',
		text: `${text}: ${secret}`,
		html: `${text}: <b>${secret}</b>`
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error)
			reply.send(Result.ERR_DB);
		else
			reply.send(Result.SUCCESS);
	});
}

export async function verifyTotpApp(request: FastifyRequest, reply: FastifyReply) {
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

	const { code } = request.body as any;

	if (null != totp.validate({ token: code, window: 1 })) {
		confirmAppTotp(db, user.userId);
		return reply.send(Result.SUCCESS);
	}

	return reply.send(Result.ERR_BAD_TOTP);
}

export function verifyEmailTotp(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;

	const { code } = request.body as any;
	console.log(code);
	if (code == user.totpSecret)
		return reply.send(Result.SUCCESS_TOTP);

	return reply.send(Result.ERR_BAD_TOTP);
}

export function disableTotp(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const user = request.user;
	return reply.send(disableTotpDb(db, user.userId));
}
