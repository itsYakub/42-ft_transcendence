import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import { userEndpoints } from "./backend/user/userEndpoints.js";
import { DatabaseSync } from "node:sqlite";
import { googleAuth } from "./backend/user/googleAuth.js";
import { homePage } from "./backend/pages/home/home.js";
import { profilePage } from "./backend/pages/profile/profile.js";
import { matchesPage } from "./backend/pages/matches/matches.js";
import { friendsPage } from "./backend/pages/friends/friends.js";
import { playPage } from "./backend/pages/play/play.js";
import { tournamentPage } from "./backend/pages/tournament/tournament.js";
import { initUsers } from "./backend/user/userDB.js";
import { initFriends } from "./backend/pages/friends/friendsDB.js";
import { initMatches } from "./backend/pages/matches/matchesDB.js";
import { devEndpoints } from "./backend/devTools.js";
import { initTournaments } from "./backend/pages/tournament/tournamentDB.js";
import { tournamentMatchPage } from "./backend/pages/tournamentMatch/tournamentMatch.js";
const __dirname = import.meta.dirname;
const fastify = Fastify({
    ignoreTrailingSlash: true,
});
fastify.register(fastifyCookie);
fastify.register(fastifyStatic, {
    root: __dirname + "/frontend"
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
    homePage(fastify, db);
    playPage(fastify, db);
    tournamentPage(fastify, db);
    tournamentMatchPage(fastify, db);
    profilePage(fastify, db);
    matchesPage(fastify, db);
    friendsPage(fastify, db);
    googleAuth(fastify, db);
    userEndpoints(fastify, db);
    devEndpoints(fastify, db);
    fastify.listen({ port: parseInt(process.env.PORT) }, (err, address) => {
        if (err) {
            console.log(err);
            fastify.log.error(err);
            process.exit(1);
        }
    });
}
catch (e) {
    console.log("Fatal error - exiting!");
}
