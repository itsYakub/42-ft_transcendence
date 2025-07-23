import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser } from '../../user/userDB.js';

export function matchesPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/matches', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);

		if (user.error) {
			return reply.redirect("/");
		}

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

	fastify.post("/matches/add", async (request: FastifyRequest, reply: FastifyReply) => {
		// const response = addMatch(db, user.id, JSON.parse(request.body as string));
		// if (response.error) {
		// 	return reply.code(user.code).send(user);
		// }
		// return reply.send(response);
	});
}

export function matchesHtml(db: DatabaseSync, user: any): string {
	const html = matchesHtmlString;

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {

	const matches = [
		{
			"date": new Date().toLocaleDateString("pl-PL"),
			"opponent": "Ed",
			"opponentId": 3,
			"score": 1,
			"opponentScore": 10,
			"friend": false
		},
		{
			"date": new Date().toLocaleDateString("pl-PL"),
			"opponent": "John",
			"opponentId": 5,
			"score": 10,
			"opponentScore": 5,
			"friend": false
		},
	];
	// sort by date
	let matchList = "";
	matches.forEach((value) => {
		matchList += matchHtml(value);
	});

	html = html.replaceAll("%%MATCHLIST%%", matchList);

	return html;
}

function matchHtml(match: any): string {
	// change colour if online?
	// without remote players we can't add friends from here

	const scoreColour = match.score > match.opponentScore ? "green" : "red";
	const opponentScoreColour = match.score < match.opponentScore ? "green" : "red";

	let friendButton = `<button class="addToFriendsButton text-green-300 cursor-pointer" data-id="${match.opponentId}" data-nick="${match.opponent}"></data>Add friend</button>`;

	if (match.friend) {
		friendButton = `<button class="removeFriendButton text-red-300 cursor-pointer" data-id="${match.opponentId}"></data>Remove friend</button>`;
	}

	return `<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-white">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<div>${match.date}</div>
								<div>You <span class="text-${scoreColour}-300">${match.score}</span> - <span class="text-${opponentScoreColour}-300">${match.opponentScore}</span> ${match.opponent}</div>
							</div>
							<div class="text-right my-auto">${friendButton}</div>
						</div>
					</div>`;
}

const matchesHtmlString: string = `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full w-200 m-auto text-center flex flex-row">
			<div class="w-60">
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
