import Fastify from "fastify";
import env from "./config/env.js";
import routes from "./routes/routes.js";
import path from "node:path";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyFormbody from "@fastify/formbody";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	ignoreTrailingSlash: true
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

// Other recommended plugins
// await fastify.register(fastifyCors);
// await fastify.register(fastifyHelmet);
// await fastify.register(fastifyCompress);
// await fastify.register(fastifyGracefulShutdown);
// await fastify.register(fastifyFormbody);

// Add the routes
await fastify.register(routes);

// Start listening
fastify.listen({ port: env.port }, (err, address) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});
