import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { homeView } from '../views/homeView.js';
import { frameView } from '../views/frameView.js';
import { loggedOutView } from '../views/loggedOutView.js';
import { getUser } from '../db/userDB.js';

/*
	Handles the home page route
*/
export function homeRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const userBox = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		console.log(userBox);
		//request.isPage = ["/", "/game", "/account", "/history", "/users", "/friends", "/foes", "/profile"].includes(request.url);
		const language = request.cookies.language ?? "english";

		const params = {
			user: userBox.user,
			page: request.url,
			language
		};
		if (userBox.user) {
			
			console.log("here");
			return reply.type("text/html").send(frameView(params, homeView(params)));
		}
		else
			return reply.type("text/html").send(frameView(params, loggedOutView()));
	});
}
