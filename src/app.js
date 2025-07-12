import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import { DB } from "./backend/db/db.js";
import { GameRouter } from "./backend/game/GameRouter.js";
import { NavRouter } from "./backend/navigation/ViewRouter.js";
import { UserRouter } from "./backend/user/UserRouter.js";
const __dirname = import.meta.dirname;
const fastify = Fastify({
    ignoreTrailingSlash: true
});
fastify.register(fastifyStatic, {
    root: __dirname + "/frontend/public"
});
fastify.register(fastifyCookie);
const db = new DB(true);
new GameRouter(fastify, db).registerRoutes();
new NavRouter(fastify, db).registerRoutes();
new UserRouter(fastify, db).registerRoutes();
fastify.listen({ port: parseInt(process.env.PORT) }, (err, address) => {
    if (err) {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    }
});
