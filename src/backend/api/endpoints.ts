import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { addTotpApp, addTotpEmail, disableTotp, verifyEmailTotp, verifyTotpApp } from "./totpEndpoints.js";

export function registerEndpoints(fastify: FastifyInstance): void {
	fastify.post("/api/totp/app", (request: FastifyRequest, reply: FastifyReply) => addTotpApp(request, reply));
	fastify.post("/api/totp/email", (request: FastifyRequest, reply: FastifyReply) => addTotpEmail(request, reply));
	fastify.post("/api/totp/app/verify", (request: FastifyRequest, reply: FastifyReply) => verifyTotpApp(request, reply));
	fastify.post("/api/totp/email/verify", (request: FastifyRequest, reply: FastifyReply) => verifyEmailTotp(request, reply));
	fastify.post("/api/totp/disable", (request: FastifyRequest, reply: FastifyReply) => disableTotp(request, reply));
	
	// fastify.post("/api/", (request: FastifyRequest, reply: FastifyReply) => (request, reply));
	// fastify.post("/api/", (request: FastifyRequest, reply: FastifyReply) => (request, reply));
	// fastify.post("/api/", (request: FastifyRequest, reply: FastifyReply) => (request, reply));
}

