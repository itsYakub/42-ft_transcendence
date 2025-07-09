import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import ejs from "ejs";
import { DatabaseSync } from 'node:sqlite';
import { GameRouter } from "./backend/game/GameRouter.js";
import { NavRouter } from "./backend/navigation/NavRouter.js";
import { UserRouter } from "./backend/auth/UserRouter.js";
const __dirname = import.meta.dirname;
const fastify = Fastify({
    ignoreTrailingSlash: true
});
fastify.register(fastifyView, {
    engine: {
        ejs,
    },
    root: __dirname + "/frontend/views",
    viewExt: "html",
});
fastify.register(fastifyStatic, {
    root: __dirname + "/frontend/public"
});
fastify.register(fastifyCookie);
const db = new DatabaseSync(process.env.DB);
new GameRouter(fastify, db).registerRoutes();
new NavRouter(fastify).registerRoutes();
new UserRouter(fastify, db).registerRoutes();
fastify.listen({ port: parseInt(process.env.PORT) }, (err, address) => {
    if (err) {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    }
});
