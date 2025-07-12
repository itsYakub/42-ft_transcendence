import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import ejs from "ejs";
import { DatabaseSync } from 'node:sqlite';
import { GameRouter } from "./backend/game/GameRouter.js";
import { NavRouter } from "./backend/navigation/ViewRouter.js";
import { UserRouter } from "./backend/user/UserRouter.js";
import { DB } from "./backend/db/db.js";
const __dirname = import.meta.dirname;
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
fastify.register(fastifyCookie);
// Creates or opens the database
//const db = new DatabaseSync(process.env.DB);
const db = new DB(true);
// Adds all the possible routes
//new GameRouter(fastify, db).registerRoutes();
new NavRouter(fastify, db).registerRoutes();
//new UserRouter(fastify, db).registerRoutes();
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
