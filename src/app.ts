import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyCookie from "fastify-cookie";
import { DB } from "./backend/db/db.js";
import { userEndpoints } from "./backend/user/userEndpoints.js";
import { readFileSync } from "fs";
import { join } from "path";
import fastifyCors from "@fastify/cors";
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
	// https: {
	//   key: readFileSync(join(__dirname, 'transcendence.key')),
	//   cert: readFileSync(join(__dirname, 'transcendence.crt'))
	// }
});

// fastify.register(fastifyCors), {
// 	origin: "*"
// };

fastify.register(fastifyCookie);

// Has all the static files (css, js, etc.)
fastify.register(fastifyStatic, {
	root: __dirname + "/frontend"
});

// Creates or opens the database
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

// Start listening
fastify.listen({ port: parseInt(process.env.PORT) }, (err, address) => {
	if (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}
});
