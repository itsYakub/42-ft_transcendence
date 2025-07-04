import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyView from "@fastify/view";

// Adds the frame around the "page"
async function addFrame(reply: FastifyReply, input: string) {
	let index = await reply.viewAsync("frame");
	let content = await reply.viewAsync(input);
	return index.replace("%%CONTENT%%", content);
}

export function defineRoutes(fastify: FastifyInstance) {
	fastify.get('/game', async (request: FastifyRequest, reply: FastifyReply) => {
		// If referer is undefined it's coming from outside and needs the index wrapper
		if (!request.headers["referer"])
			return addFrame(reply, "game");
		else 
			return reply.view("game");
	});

	fastify.get('/tournament', async (request: FastifyRequest, reply: FastifyReply) => {
		// If referer is undefined it's coming from outside and needs the index wrapper
		if (!request.headers["referer"])
			return addFrame(reply, "tournament");
		else 
			return reply.view("tournament");
	});

	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		// If referer is undefined it's coming from outside and needs the index wrapper
		if (!request.headers["referer"])
			return addFrame(reply, "home");
		else 
			return reply.view("home");
	});
}

// //import { DB } from '../config/db.js';
// import { User } from '../config/User.js';

// 	// const db = new DB();
// 	// const user = new User(db.conn);
// 	// const contact = user.create({
// 	// 	nick: 'Jane',
// 	// 	email: 'jane.doe@example.com',
// 	// });
// 	// console.log(contact);

// 	// Return all registered users from the db
// 	// fastify.get('/users', async (request, reply) => {
// 	// 	let internal = request.headers["internal"];
// 	// 	const users = db.conn.prepare("SELECT * FROM users").all();
// 	// 	var ttt = await reply.viewAsync("users", { title: "All users", users });
// 	// 	if (internal === "true") {
// 	// 		console.log("internal");
// 	// 		return ttt;
// 	// 	}
// 	// 	else {
// 	// 		console.log("external");
// 	// 		return reply.viewAsync("index", { title: "Homepage", ttt: false, content: ttt });
// 	// 	}
// 	// });

// 	// // Return one user
// 	// fastify.get('/users/:id', async (request, reply) => {
// 	// 	const { id } = request.params;
// 	// 	const user = db.conn.prepare("SELECT * FROM users WHERE id = ?").get(id);
// 	// 	if (!user) {
// 	// 		return reply.status(404).send({ error: "User not found" });
// 	// 	}

// 	// 	return reply.viewAsync("user", { title: user.nick, user });
// 	// });
