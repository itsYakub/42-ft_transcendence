import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import { DB } from "./backend/db/db.js";
import { GameRouter } from "./backend/game/GameRouter.js";
import { NavRouter } from "./backend/navigation/ViewRouter.js";
import { UserRouter } from "./backend/user/UserRouter.js";
import fastifyCors from "@fastify/cors";
const __dirname = import.meta.dirname;
const fastify = Fastify({
    ignoreTrailingSlash: true,
});
fastify.register(fastifyCors), {
    origin: "*"
};
fastify.register(fastifyCookie);
fastify.register(fastifyStatic, {
    root: __dirname + "/frontend/public"
});
const dropTables = {
    dropUsers: false,
    dropMatches: false,
    dropViews: true
};
const db = new DB(dropTables.dropUsers, dropTables.dropMatches, dropTables.dropViews);
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
