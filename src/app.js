import Fastify from "fastify";
import env from "./config/env.js";
import routes from "./routes/routes.js";
import path from "node:path";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import logger from "./config/logger.js";
import fastifyStatic from "@fastify/static";
import dbConnector from "./config/db.js";
import fastifyFormbody from "@fastify/formbody";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	//loggerInstance: logger,
});

// Adds logging
fastify.addHook("onRequest", async (request, reply) => {
  request.log.info(`Incoming request: ${request.method} ${request.url}`);
});

// More logging
fastify.addHook("onResponse", async (request, reply) => {
  request.log.info(
    `Request completed: ${request.method} ${request.url} - Status ${reply.statusCode}`
  );
});

// The views (pages) of the site
await fastify.register(fastifyView, {
	engine: {
		ejs,
	},
	root: path.join(__dirname, "views"),
	viewExt: "html",
});

// Has all the static files (css, js, etc.)
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "static"),
	prefix: "/static/",
});

// await fastify.register(fastifyCors);
// await fastify.register(fastifyHelmet);
// await fastify.register(fastifyCompress);
// await fastify.register(fastifyGracefulShutdown);
// await fastify.register(fastifyFormbody);

//fastify.register(dbConnector);

await fastify.register(routes);

fastify.listen({ port: env.port }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
