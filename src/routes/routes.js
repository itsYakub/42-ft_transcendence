import { DB } from '../config/db.js';
import { User } from '../config/User.js';

export default async function routes(fastify) {
	const db = new DB();
	const user = new User(db.conn);
	const contact = user.create({
		nick: 'Jane',
		email: 'jane.doe@example.com',
	});
	console.log(contact);

	// Return all registered users from the db
	fastify.get('/users', async (request, reply) => {
		let internal = request.headers["internal"];
		const users = db.conn.prepare("SELECT * FROM users").all();
		var ttt = await reply.viewAsync("users", { title: "All users", users });
		if (internal === "true") {
			console.log("internal");
			return ttt;
		}
		else {
			console.log("external");
			return reply.viewAsync("index", { title: "Homepage", ttt: false, content: ttt });
		}
	});

	// Return one user
	fastify.get('/users/:id', async (request, reply) => {
		const { id } = request.params;
		const user = db.conn.prepare("SELECT * FROM users WHERE id = ?").get(id);
		if (!user) {
			return reply.status(404).send({ error: "User not found" });
		}

		return reply.viewAsync("user", { title: user.nick, user });
	});

	fastify.get('/game', async (request, reply) => {
		return reply.view("game", { title: "Pong" });
	});

	fastify.get('/', async (request, reply) => {
		return reply.view("index", { title: "Homepage", ttt: false, content: "abc" });
	});
}
