import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';

/*
	Registers the routes connected with the home page
*/
export function homePage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (!user.error)
			markUserOnline(db, user.id);

		const params = { ...user, page: "home", language: request.cookies.language };

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, params);
			if (frame.error) {
				return reply.code(frame.code);
			}
			return reply.type("text/html").send(frame);
		}

		const frame = frameAndContentHtml(db, params);
		if (frame.error) {
			return reply.code(frame.code);
		}
		return reply.send(frame);
	});
}

/*
	The HTML returned to the browser. Replace any placeholders here
*/
export function homeHtml(db: DatabaseSync, user: any): string {
	let html = homeHtmlString;

	return html;
}

/*
	The HTML that represents the home page
*/
const homeHtmlString: string = `
	<!-- <img src="images/team.jpg" class="w-full h-235 opacity-5"/> -->
	<div class="h-full bg-gray-900 content-center text-center">
		<div class="text-white">Welcome to
			Transcendence!</div>
		<button id="wipeAllButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe and recreate db
		</button>
		<button id="wipeUsersButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe users
		</button>
		<button id="wipeMatchesButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe matches
		</button>
		<button id="wipeFriendsButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe friends
		</button>
		<button id="addMockUsersButton"
			class="mt-4 block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
			Add mock users
		</button>
		<button id="addMockMatchesButton"
			class="mt-4 block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
			Add mock matches
		</button>
		<button id="addMockFriendsButton"
			class="mt-4 block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
			Add mock friends
		</button>
	</div>`;
