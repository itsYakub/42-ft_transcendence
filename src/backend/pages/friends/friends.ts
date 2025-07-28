import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, getUserByEmail, markUserOnline } from '../../user/userDB.js';
import { addFriend, getFriends, removeFriend } from './friendsDB.js';
import { translateBackend } from '../translations.js';

export function friendsPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/friends', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.redirect("/");
		}

		markUserOnline(db, user.id);

		const params = { ...user, page: "friends", language: request.cookies.language ?? "english" };

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, params);
			if (frame.error) {
				return reply.code(500);
			}
			return reply.type("text/html").send(frame);
		}
		else {
			const frame = frameAndContentHtml(db, params);
			if (frame.error) {
				return reply.code(500);
			}
			return reply.send(frame);
		}
	});

	fastify.post("/friends/add", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const json = JSON.parse(request.body as string);
		json["id"] = user.id;

		const response = addFriend(db, json);
		if (response.error) {
			return reply.code(user.code).send(user);
		}
		return reply.send(response);
	});

	fastify.post("/friends/remove", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const json = JSON.parse(request.body as string);
		json["id"] = user.id;

		const response = removeFriend(db, json);
		if (response.error) {
			return reply.code(user.code).send(user);
		}
		return reply.send(response);
	});

	fastify.post("/friends/find", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const json = JSON.parse(request.body as string);
		const response = getUserByEmail(db, json.email);
		if (response.error) {
			return reply.code(response.code).send(response);
		}

		addFriend(db, {
			"id": user.id,
			"friendID": response.id
		});
		return reply.send(response);
	});
}

export function friendsHtml(db: DatabaseSync, user: any): string {
	const friends = getFriends(db, user.id);
	let html = friendsHtmlString;

	let friendList = "";
	for (var key in friends) {
		friendList += friendHtml(friends[key]);
	}

	html = html.replaceAll("%%FRIENDLIST%%", friendList);
	html = translate(html, user.language);
	
	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = [ "ADD_FRIEND" ];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%FRIENDS_${text}_TEXT%%`, translateBackend({
			language,
			text: `FRIENDS_${text}_TEXT`
		}));
	});

	return html;
}

function friendHtml(friend: any): string {
	const onlineString: string = 1 == friend.Online ? `<div class="text-green-300">Online</div>` : `<div class="text-red-300">Offline</div>`;
	return `
		<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-white">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<div>${friend.Nick}</div>
					${onlineString}
				</div>
				<div class="text-right my-auto">
					<button class="removeFriendButton cursor-pointer text-red-300" data-id="${friend.FriendID}"></data>Remove</button>
				</div>
			</div>
		</div>`;
}

const friendsHtmlString: string = `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full w-200 m-auto text-center flex flex-row">
			<div class="w-50">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="cursor-pointer text-right w-8/10 mr-4 hover:bg-gray-800 text-gray-300 p-2 rounded-lg">Profile</button>
					<button id="matchesButton"
						class="my-4 cursor-pointer text-right w-8/10 mr-4 text-gray-300 p-2 rounded-lg hover:bg-gray-800">Matches</button>
					<button id="friendsButton"
						class="text-right w-8/10 mr-4 bg-gray-800 text-gray-300 p-2 rounded-lg">Friends</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="p-8 text-left">
					<div class="text-white text-left text-xl">Friends</div>
					<div class="border my-3 h-120 p-2 rounded-lg border-gray-700 overflow-auto">
						%%FRIENDLIST%%
					</div>
					<div class="m-auto text-right">
						<button id="addFriendButton" class="border border-gray-700 p-2 cursor-pointer hover:bg-gray-700 rounded-lg text-white bg-gray-800">%%FRIENDS_ADD_FRIEND_TEXT%%</button>
					</div>
				</div>
			</div>
		</div>`;
