import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import ejs from "ejs";
import { DatabaseSync } from 'node:sqlite';
import { GameRouter } from "./backend/game/GameRouter.js";
import { NavRouter } from "./backend/navigation/NavRouter.js";
import { UserRouter } from "./backend/auth/UserRouter.js";

const __dirname = import.meta.dirname;

console.log();

const fastify = Fastify({
	ignoreTrailingSlash: true
});

// The views (pages) of the site
fastify.register(fastifyView, {
	engine: {
		ejs,
	},
	root: __dirname + "/frontend/views",
	viewExt: "html",
});

// Has all the static files (css, js, etc.)
fastify.register(fastifyStatic, {
	root: __dirname + "/frontend/public"
});


// Creates the database. Probably have to put this in the .env file later
const db = new DatabaseSync(process.env.DB);

// Adds all the possible routes
new GameRouter(fastify, db).registerRoutes();
new NavRouter(fastify).registerRoutes();
new UserRouter(fastify, db).registerRoutes();

// Start listening
fastify.listen({ port: parseInt(process.env.PORT) }, (err, address) => {
	if (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}
});

// import fastifyCors from "@fastify/cors";
// import fastifyHelmet from "@fastify/helmet";
// import fastifyCompress from "@fastify/compress";
// import fastifyGracefulShutdown from "fastify-graceful-shutdown";

// Other recommended plugins
// await fastify.register(fastifyCors);
// await fastify.register(fastifyHelmet);
// await fastify.register(fastifyCompress);
// await fastify.register(fastifyGracefulShutdown);
