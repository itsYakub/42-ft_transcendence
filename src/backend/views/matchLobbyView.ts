import { GameChatMessage, MatchGamer, User } from "../../common/interfaces.js";
import { gameHtmlString } from "../game/game.js";

export function matchLobbyView(g1: MatchGamer, g2: MatchGamer, chats: GameChatMessage[], user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto">
		<h1 id="gameTitle" class="text-white pt-4 mb-4 text-4xl text-center">%%TEXT_REMOTE_MATCH%%</h1>
		<div class="flex flex-row h-150">
			<div id="matchLobbyDetailsContainer" class="flex flex-col w-69">
				${gamersString(g1, g2, user)}
			</div>
			<div class="grow border border-gray-700 rounded-lg p-2">				
				<div class="flex flex-col h-full">
					<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${messagesString(chats, user)}
					</div>
					<div class="mt-2">
						<div class="flex flex-row gap-1">
							<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
							<input type="submit" hidden>
							<button type="submit" class="border border-gray-700 py-0.5 px-2 cursor-pointer hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-gray-300 fa-solid fa-play"></i></button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	${gameHtmlString()}
	`;
}

export function gamersString(g1: MatchGamer, g2: MatchGamer, user: User): string {
	const html = `
	<div class="flex flex-col gap-8">
		${gamerString(g1)}
		${gamerString(g2)}
	</div>
	<div class="flex flex-row justify-between mr-9">
		${readyButtonString(g1, g2, user)}
		<button id="leaveMatchButton" type="submit" class="text-gray-300 mt-4 bg-red-600 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
	</div>
	`;

	return html;
}

export function messagesString(chats: GameChatMessage[], user: User): string {
	let messageList = "";
	for (var key in chats) {
		messageList += messageString(user.userId, chats[key]);
	}

	return messageList;
}

function gamerString(gamer: MatchGamer) {
	if (!gamer)
		return "";

	const readyText = gamer.ready ? `<i class="fa-solid fa-check text-green-300 my-auto"></i>` : `<i class="fa-solid fa-xmark text-red-300 my-auto"></i>`;

	return `
	<div class="flex flex-row mr-2">
		<div class="w-60 py-2 mr-2 border border-gray-700 rounded-lg text-gray-400 text-center">${gamer.nick}</div>
		${readyText}
	</div>
	`;
}

function readyButtonString(g1: MatchGamer, g2: MatchGamer, user: User) {
	const gamer = g1.userId == user.userId ? g1 : g2;
	return gamer.ready ? `<button disabled class="text-gray-300 mt-4 bg-gray-800 block py-1 px-4 rounded-lg">%%BUTTON_READY%%</button>` :
		`<button id="matchGamerReadyButton" class="text-gray-300 mt-4 bg-gray-800 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_READY%%</button>`;
}

function messageString(userId: number, chat: GameChatMessage) {
	return userId == chat.fromId ?
		`
	<div class="bg-green-700 ml-auto px-4 py-2 rounded-lg">
		<div class="text-gray-300">${chat.chat}</div>
	</div>	
	`
		:
		`
	<div class="bg-blue-700 mr-auto px-4 py-2 rounded-lg">
		<div class="text-white font-bold">${chat.nick}</div>
		<div class="text-gray-300">${chat.chat}</div>
	</div>
	`;
}
