import { FastifyInstance, FastifyReply } from 'fastify';

export abstract class Router {
	constructor(protected fastify: FastifyInstance) { }

	// Adds the frame around the "page"
	protected async addFrame(reply: FastifyReply, input: string) {
		let index = await reply.viewAsync("frame");
		let content = await reply.viewAsync(input);
		return index.replace("%%CONTENT%%", content);
	}

	// Overridden by child classes
	abstract registerRoutes(): void;
}
