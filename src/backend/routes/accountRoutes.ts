import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
//import nodemailer from 'nodemailer';
import { accountView } from '../views/accountView.js';
import { frameView } from '../views/frameView.js';

export function accountRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/account', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const params = {
			user,
			language
		};
		const html = accountView(params);

		const frame = frameView(params, html);
		return reply.type("text/html").send(frame);
	});
}
