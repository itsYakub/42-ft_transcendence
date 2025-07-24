import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { getMatches } from './matchesDB.js';

export function matchesPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/matches', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.error) {
			return reply.redirect("/");
		}

		markUserOnline(db, user.id);

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, "matches", user);
			if ("db_error" == frame) {
				return reply.code(500);
			}
			return reply.code(200).type("text/html").send(frame);
		}
		else {
			const frame = frameAndContentHtml(db, "matches", user);
			if ("db_error" == frame.navbar) {
				return reply.code(500);
			}
			return reply.code(200).send(frame);
		}
	});

	// fastify.post("/matches/add", async (request: FastifyRequest, reply: FastifyReply) => {
	// 	const response = addMatch(db, user.id, JSON.parse(request.body as string));
	// 	if (response.error) {
	// 		return reply.code(user.code).send(user);
	// 	}
	// 	return reply.send(response);
	// });
}

export function matchesHtml(db: DatabaseSync, user: any): string {
	const matches = getMatches(db, user.id);
	let html = matchesHtmlString;

	let matchList = "";
	for (var key in matches) {
		matchList += matchHtml(matches[key]);
	}

	html = html.replaceAll("%%MATCHLIST%%", matchList);

	return html;
}

function matchHtml(match: any): string {
	let ratingColour: string;
	switch (match.Rating) {
		case 0: ratingColour = "text-red-300";
			break;
		case 1: ratingColour = "text-white-300";
			break;
		case 2: ratingColour = "text-green-300";
			break;
		default: ratingColour = "text-yellow-300";
			break;		
	}

	return `
		<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-white">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<div>${match.PlayedAt}</div>
					<div class="${ratingColour}">${match.Message}</div>
				</div>
			</div>
		</div>`;
}

const matchesHtmlString: string = `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full w-200 m-auto text-center flex flex-row">
			<div class="w-50">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="cursor-pointer text-right w-8/10 mr-4  text-gray-300 hover:bg-gray-800 p-2 rounded-lg">Profile</button>
					<button id="matchesButton"
						class="my-4 text-right w-8/10 mr-4 bg-gray-800 text-gray-300 p-2 rounded-lg">Matches</button>
					<button id="friendsButton"
						class="cursor-pointer text-right w-8/10 mr-4 text-gray-300 p-2 rounded-lg hover:bg-gray-800">Friends</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="p-8 text-left">
					<div class="text-white text-left text-xl">Matches</div>
					<div class="border my-3 h-120 p-2 rounded-lg border-gray-700 overflow-auto">
						%%MATCHLIST%%					
					</div>
				</div>
			</div>
		</div>
	</div>`;
