import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import ejs from "ejs";
import { DatabaseSync } from 'node:sqlite';
import { GameRouter } from "./routers/GameRouter.js";
import { NavRouter } from "./routers/NavRouter.js";
import { UserRouter } from "./routers/UserRouter.js";
const __dirname = import.meta.dirname;
const fastify = Fastify({
    ignoreTrailingSlash: true
});
fastify.register(fastifyView, {
    engine: {
        ejs,
    },
    root: __dirname + "/views",
    viewExt: "html",
});
fastify.register(fastifyStatic, {
    root: __dirname + "/static",
    prefix: "/static/",
});
const db = new DatabaseSync("./transcendence.db");
new GameRouter(fastify, db).registerRoutes();
new NavRouter(fastify).registerRoutes();
new UserRouter(fastify, db).registerRoutes();
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    }
});
