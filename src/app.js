import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import { userEndpoints } from "./backend/user/userEndpoints.js";
import { readFileSync } from "fs";
import { join } from "path";
import { DatabaseSync } from "node:sqlite";
import { googleAuth } from "./backend/user/googleAuth.js";
import { getUser, initUsers } from "./backend/user/userDB.js";
import { initFriends } from "./backend/pages/friends/friendDB.js";
import { initMatches } from "./backend/pages/matches/matchDB.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/pages/tournament/tournamentDB.js";
import { frameHtml } from "./backend/pages/frame.js";
import { matchRoutes } from "./backend/pages/matches/matchRoutes.js";
import { friendRoutes } from "./backend/pages/friends/friendRoutes.js";
import { homeRoutes } from "./backend/pages/home/homeRoutes.js";
import { tournamentRoutes } from "./backend/pages/tournament/tournamentRoutes.js";
import { profileRoutes } from "./backend/pages/profile/profileRoutes.js";
import { playRoutes } from "./backend/pages/play/playRoutes.js";
const __dirname = import.meta.dirname;
const fastify = Fastify({
    ignoreTrailingSlash: true,
    https: {
        key: readFileSync(join(__dirname, 'transcendence.key')),
        cert: readFileSync(join(__dirname, 'transcendence.crt'))
    }
});
fastify.register(fastifyCookie);
fastify.register(fastifyStatic, {
    root: __dirname + "/frontend"
});
fastify.setNotFoundHandler(async (request, reply) => {
    const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
    const params = {
        user,
        errorCode: 404,
        errorMessage: "ERR_NOT_FOUND",
        page: "home",
        language: request.cookies.language ?? "english"
    };
    const frame = frameHtml(params);
    return reply.type("text/html").send(frame);
});
const dropTables = {
    dropUsers: false,
    dropFriends: false,
    dropMatches: false,
    dropTournaments: false
};
const db = new DatabaseSync(process.env.DB);
try {
    initUsers(db, dropTables.dropUsers);
    initFriends(db, dropTables.dropFriends);
    initMatches(db, dropTables.dropMatches);
    initTournaments(db, dropTables.dropTournaments);
    homeRoutes(fastify, db);
    playRoutes(fastify, db);
    tournamentRoutes(fastify, db);
    profileRoutes(fastify, db);
    matchRoutes(fastify, db);
    friendRoutes(fastify, db);
    googleAuth(fastify, db);
    userEndpoints(fastify, db);
    devEndpoints(fastify, db);
    fastify.listen({ host: "0.0.0.0", port: parseInt(process.env.PORT) }, (err, address) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    });
}
catch (e) {
    console.log("Fatal error - exiting!");
}
