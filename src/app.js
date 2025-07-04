import Fastify from "fastify";
import { defineRoutes } from "./routes/routes.js";
import fastifyView from "@fastify/view";
import ejs from "ejs";
import fastifyStatic from "@fastify/static";
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
defineRoutes(fastify);
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    }
});
