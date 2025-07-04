import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import { defineRoutes } from "./routes/routes.js";
import ejs from "ejs";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	ignoreTrailingSlash: true
});

// The views (pages) of the site
fastify.register(fastifyView, {
	engine: {
		ejs,
	},
	root: __dirname + "/views",
	viewExt: "html",
});

// Has all the static files (css, js, etc.)
fastify.register(fastifyStatic, {
	root: __dirname + "/static",
	prefix: "/static/",
});

// Adds all the possible routes
defineRoutes(fastify);

// Start listening
fastify.listen({ port: 3000 }, (err, address) => {
	if (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}
});
