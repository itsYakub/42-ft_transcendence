import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser } from '../../user/userDB.js';
import { updateAvatar, updateNick, updatePassword } from './profileDB.js';

export function profilePage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/profile', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.redirect("/");
		}

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, "profile", user);
			if ("db_error" == frame) {
				return reply.code(500);
			}
			return reply.type("text/html").send(frame);
		}
		else {
			const frame = frameAndContentHtml(db, "profile", user);
			if ("db_error" == frame.navbar) {
				return reply.code(500);
			}
			return reply.send(frame);
		}
	});

	fastify.post('/profile/password', async (request: FastifyRequest, reply: FastifyReply) => {
		const fullUser: boolean = true;
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken, fullUser);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const response = updatePassword(db, user, JSON.parse(request.body as string));
		if (response.error) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});

	fastify.post('/profile/nick', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const response = updateNick(db, user.id, JSON.parse(request.body as string).nick);
		if (response.error) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});

	fastify.post('/profile/avatar', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		if (user.error) {
			return reply.code(user.code).send(user);
		}

		const response = updateAvatar(db, user.id, JSON.parse(request.body as string).avatar);
		if (response.error) {
			return reply.code(response.code).send(response);
		}
		return reply.send(response);
	});
}

export function profileHtml(db: DatabaseSync, user: any): string {
	const html = profileHtmlString;

	return injectUser(html, user);
}

function injectUser(html: string, user: any): string {
	html = html.replaceAll("%%NICK%%", user.nick);
	html = html.replaceAll("%%AVATAR%%", user.avatar);
	if (user.google)
		html = html.replaceAll("%%CHANGEPASSWORDVISIBILITY%%", "hidden");
	else
		html = html.replaceAll("%%CHANGEPASSWORDVISIBILITY%%", "visible");

	return html;
}

const profileHtmlString: string = `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full w-200 m-auto text-center flex flex-row">
			<div class="w-60">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="text-right w-8/10 mr-4 bg-gray-800 text-gray-300 p-2 rounded-lg">Profile</button>
					<button id="matchesButton"
						class="my-4 cursor-pointer text-right w-8/10 mr-4 text-gray-300 p-2 rounded-lg hover:bg-gray-800">Matches</button>
					<button id="friendsButton"
						class="cursor-pointer text-right w-8/10 mr-4 text-gray-300 p-2 rounded-lg hover:bg-gray-800">Friends</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="p-8 m-auto text-left">
					<div class="text-white text-left text-xl">User Profile</div>
					<div class="my-3 p-3 border border-gray-700 rounded-lg %%CHANGEPASSWORDVISIBILITY%%">
						<span class="text-white font-medium mb-4">Change password</span>
						<form id="changePasswordForm">
							<div>
								<input type="password" id="currentPassword" placeholder="Current password" required="true"
									class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
							</div>
							<div>
								<input type="password" id="newPassword" placeholder="New password" minlength="8" required="true"
									class="my-2 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
							</div>
							<div>
								<input type="password" id="repeatPassword" placeholder="Repeat password" minlength="8" required="true"
									class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
							</div>
							<div>
								<button type="submit" formmethod="post"
									class="ml-auto cursor-pointer block text-right mt-2 text-white hover:bg-gray-800 font-medium rounded-lg p-2">Update</button>
							</div>
						</form>
					</div>
					<div class="my-4 p-3 border border-gray-700 rounded-lg ">
						<span class="text-white font-medium">Change nickname</span>
						<form id="changeNickForm">
							<div>
								<input type="text" id="newNick" placeholder="New nickname" required="true"
									class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
							</div>
							<div>
								<button type="submit" formmethod="post"
									class="ml-auto cursor-pointer block text-right mt-2 text-white hover:bg-gray-800 font-medium rounded-lg p-2">Update</button>
							</div>
						</form>
					</div>
					<div class="my-4 p-3 border border-gray-700 rounded-lg ">
						<span class="text-white font-medium">Change Avatar</span>
						<div>
							<img class="my-1 w-20 h-20 cursor-pointer" src="%%AVATAR%%" id="avatarImage" />
							<input type="file" id="avatarFilename" accept=".png, .jpg, .jpeg" class="hidden">
						</div>
						<input type="hidden" id="userId" value="%%ID%%" />
					</div>
					<div class="my-4 p-3 border border-gray-700 rounded-lg ">
						<div>
							<button id="invalidateTokenButton"
								class="mx-auto cursor-pointer block bg-red-500 text-right mt-2 text-white hover:bg-gray-800 font-medium rounded-lg p-2">Invalidate token</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>`;
