import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import { DB } from "./backend/db/db.js";
import { GameRouter } from "./backend/game/GameRouter.js";
import { NavRouter } from "./backend/navigation/ViewRouter.js";
import { UserRouter } from "./backend/user/UserRouter.js";
import { readFileSync } from "fs";
import { join } from "path";
import fastifyCors from "@fastify/cors";

const __dirname = import.meta.dirname;

const fastify = Fastify({
	ignoreTrailingSlash: true,
	// https: {
    //   key: readFileSync(join(__dirname, 'transcendence.key')),
    //   cert: readFileSync(join(__dirname, 'transcendence.crt'))
    // }
});

fastify.register(fastifyCors), {
    origin: "*"
};


fastify.register(fastifyCookie);

// Has all the static files (css, js, etc.)
fastify.register(fastifyStatic, {
	root: __dirname + "/frontend/public"
});

// Creates or opens the database
const dropTables = {
	dropUsers: false,
	dropMatches: false,
	dropViews: true
};
const db = new DB(dropTables.dropUsers, dropTables.dropMatches, dropTables.dropViews);

// Adds all the possible routes
new GameRouter(fastify, db).registerRoutes();
new NavRouter(fastify, db).registerRoutes();
new UserRouter(fastify, db).registerRoutes();

// Start listening
fastify.listen({ port: parseInt(process.env.PORT) }, (err, address) => {
	if (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}
});

// import fastifyHelmet from "@fastify/helmet";
// import fastifyGracefulShutdown from "fastify-graceful-shutdown";

// Other recommended plugins
// await fastify.register(fastifyHelmet);
// await fastify.register(fastifyGracefulShutdown);
