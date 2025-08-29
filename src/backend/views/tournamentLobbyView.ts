import { GameChatMessage, Gamer, User } from "../../common/interfaces.js";
import { gameHtmlString } from "../game/game.js";

export function tournamentLobbyView(gamers: Gamer[], chats: GameChatMessage[], user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto">
		<h1 id="tournamentTitle" class="text-white pt-4 mb-4 text-3xl text-center">%%TEXT_TOURNAMENT%% - ${gamers.length} / 4 %%TEXT_PLAYERS%%</h1>
		<div class="flex flex-row h-150">
			<div id="tournamentDetailsContainer" class="flex flex-col w-69">
				${tournamentGamersHtml(gamers)}
			</div>
			<div class="grow border border-gray-700 rounded-lg p-2">				
				<div class="flex flex-col h-full">
					<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${tournamentMessagesHtml(chats, user)}
					</div>
					<div class="mt-2">
						<form id="sendTournamentMessageForm">
							<div class="flex flex-row gap-1">
								<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
								<input type="submit" hidden>
								<button type="submit" class="border border-gray-700 py-0.5 px-2 cursor-pointer hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-gray-300 fa-solid fa-play"></i></button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	${gameHtmlString()}
	`;
}

export function tournamentGamersHtml(gamers: Gamer[]): string {
	let gamersString = "";
	gamers.forEach(gamer => {
		gamersString += tournamentGamerHtml(gamer);
	});
	
	return `
	<div class="flex flex-col gap-8">
		${gamersString}
	</div>
	<button id="leaveTournamentButton" class="text-gray-300 mt-4 mx-auto bg-red-600 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
	`;
}

function tournamentGamerHtml(gamer: Gamer) {
	return `
	<div class="tournamentGamer w-60 py-2 mx-auto border border-gray-700 rounded-lg text-gray-400 text-center">${gamer.nick}</div>
	`;
}

function tournamentMessagesHtml(chats: GameChatMessage[], user: User): string {
	let messageList = "";
	for (var key in chats) {
		messageList += tournamentMessageHtml(user.userId, chats[key]);
	}

	return messageList;
}

function tournamentMessageHtml(userId: number, chat: GameChatMessage) {
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
