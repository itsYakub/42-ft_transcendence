import { GameChatMessage, Gamer, User } from "../../common/interfaces.js";
import { gameDialogHtml } from "./dialogsView.js";

export function tournamentLobbyView(gamers: Gamer[], chats: GameChatMessage[], user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto">
		<h1 id="tournamentTitle" class="text-white pt-4 mb-4 text-3xl text-center">%%TEXT_REMOTE_TOURNAMENT%%</h1>
		<div class="flex flex-row h-120">
			<div class="flex flex-col gap-2">
				<fieldset class="border border-gray-700 rounded-lg p-3 pb-5">
					<legend id="tournamentPlayersLegend" class="text-gray-300">${gamers.length} / 4 %%TEXT_PLAYERS%%</legend>		
					<div id="tournamentDetailsContainer" class="flex flex-col w-75">
						${tournamentGamersHtml(gamers)}
					</div>
				</fieldset>
				<div id="leaveTournamentButton" class="text-red-300 mt-4 mx-auto cursor-[url(/images/pointer.png),pointer] py-1 px-2 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</div>
			</div>
			<fieldset class="grow border border-gray-700 rounded-lg p-3 ml-4">
				<legend class="text-gray-300">%%TEXT_CHAT%%</legend>			
				<div class="flex flex-col h-full">
					<div id="tournamentMessagesDiv" class="flex flex-col-reverse grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${tournamentMessagesHtml(chats, user)}
					</div>
					<div class="mt-2">
						<form id="sendTournamentMessageForm">
							<div class="flex flex-row gap-1">
								<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
								<input type="submit" hidden>
								<button type="submit" class="border border-gray-700 py-0.5 px-2 cursor-[url(/images/pointer.png),pointer] hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-gray-300 fa-solid fa-play"></i></button>
							</div>
						</form>
					</div>
				</div>
			</fieldset>
		</div>
	</div>
	${gameDialogHtml()}
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
	`;
}

function tournamentGamerHtml(gamer: Gamer) {
	return `
	<div class="tournamentGamer py-2 w-full border border-gray-700 rounded-lg text-gray-400 text-center">${gamer.nick}</div>
	`;
}

export function tournamentMessagesHtml(chats: GameChatMessage[], user: User): string {
	let messageList = "";
	for (var key in chats) {
		messageList += tournamentMessageHtml(user.userId, chats[key]);
	}

	return messageList;
}

function tournamentMessageHtml(userId: number, chat: GameChatMessage) {
	return userId == chat.fromId ?
		`
	<div class="bg-green-700 ml-auto py-2 rounded-lg">
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
