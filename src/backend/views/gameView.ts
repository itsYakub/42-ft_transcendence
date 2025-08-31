import { Game, GameType, User } from "../../common/interfaces.js";
import { gameHtml } from "./dialogsView.js";

export function gameView(games: Game[], user: User): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<div class="flex flex-row h-150 justify-center pt-8 mx-auto">
			<div class="w-100 flex flex-col gap-8">
				<p class="text-gray-300 text-2xl">%%TEXT_JOIN%%</p>
				<div class="flex flex-col border p-2 border-gray-700 rounded-lg grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
					${gamesHtml(games)}
				</div>
			</div>
			<div class="w-85 flex flex-col">
				<p class="text-gray-300 text-2xl mt-2">%%TEXT_CREATE%%</p>
				<p class="text-gray-300 text-lg mt-12 mb-4">Offline</p>
				<button id="localMatchButton" class="w-50 text-white bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_MATCH%%</button>
				<button id="aiMatchButton" class="w-50 my-8 text-gray-300 bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_AI_MATCH%%</button>			
				<button id="localTournamentButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_TOURNAMENT%%</button>				
				<p class="text-gray-300 text-lg mt-8 mb-4">Online</p>
				<button id="remoteMatchButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_MATCH%%</button>
				<button id="remoteTournamentButton" class="w-50 mt-8 text-gray-300 bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_TOURNAMENT%%</button>
			</div>
		</div>
	</div>
	${gameHtml()}
	`;
}

function gamesHtml(games: Game[]): string {
	let gameStrings: string = "";

	games.forEach(game => {
		gameStrings += gameButtonHtml(game);
	});

	return gameStrings;
}

function gameButtonHtml(game: Game): string {
	const gameID: string = game.gameId;
	const gamers: string[] = game.nicks.split(",");
	if ((GameType.TOURNAMENT == game.type && 4 == gamers.length) || (GameType.MATCH == game.type && 2 == gamers.length))
		return "";

	let gamersString = "";
	gamers.forEach((name) => {
		gamersString += nameHtml(name);
	});

	return GameType.TOURNAMENT == game.type ? `
	<button class="joinTournamentButton w-full text-gray-300 bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700" data-id="${gameID}"><span class="text-green-300">%%TEXT_TOURNAMENT%%</span>${gamersString}</button>
	`
	:
	`
	<button class="joinMatchButton w-full text-gray-300 bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700" data-id="${gameID}"><span class="text-green-300">%%TEXT_MATCH%%</span>${gamersString}</button>
	`;
}

function nameHtml(gamer: string) {
	return `
	<div class="">${gamer}</div>
	`;
}
