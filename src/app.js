import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import { DB } from "./backend/db/db.js";
import { userEndpoints } from "./backend/user/userEndpoints.js";
import { googleAuth } from "./backend/user/googleAuth.js";
import { homePage } from "./backend/pages/home.js";
import { profilePage } from "./backend/pages/profile.js";
import { matchesPage } from "./backend/pages/matches.js";
import { friendsPage } from "./backend/pages/friends.js";
import { playPage } from "./backend/pages/play.js";
import { tournamentPage } from "./backend/pages/tournament.js";
const __dirname = import.meta.dirname;
const fastify = Fastify({
    ignoreTrailingSlash: true,
});
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
homePage(fastify, db);
playPage(fastify, db);
tournamentPage(fastify, db);
profilePage(fastify, db);
matchesPage(fastify, db);
friendsPage(fastify, db);
googleAuth(fastify, db);
userEndpoints(fastify, db);
fastify.listen({ port: parseInt(process.env.PORT) }, (err, address) => {
    if (err) {
        console.log(err);
        fastify.log.error(err);
        process.exit(1);
    }
});
