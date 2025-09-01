import { Game, GameType, User } from "../../common/interfaces.js";
import { gameHtml } from "./dialogsView.js";

export function gameView(games: Game[], user: User): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900 m-auto">
		<div class="flex flex-row pt-8 justify-center gap-2">
			<fieldset class="w-100 h-108 flex flex-col gap-8 border border-gray-700 rounded-lg p-3 pb-5">
				<legend class="text-gray-300">%%TEXT_JOIN%%</legend>
				<div class="flex flex-col  grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
					${gamesHtml(games)}
				</div>
			</fieldset>
			<div class="flex flex-col gap-4">
				<fieldset class="w-85 flex flex-col items-center border border-gray-700 rounded-lg p-3 pb-5 gap-8">
					<legend class="text-gray-300">%%TEXT_CREATE_LOCAL%%</legend>
					<button id="localMatchButton" class="w-50 text-white bg-gray-800 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_MATCH%%</button>
					<button id="aiMatchButton" class="w-50 text-gray-300 bg-gray-800 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_AI_MATCH%%</button>			
					<button id="localTournamentButton" class="w-50 text-gray-300 bg-gray-800 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_TOURNAMENT%%</button>				
				</fieldset>
				<fieldset class="w-85 flex flex-col items-center border border-gray-700 rounded-lg p-3 pb-5 gap-8">
					<legend class="text-gray-300">%%TEXT_CREATE_REMOTE%%</legend>
					<button id="remoteMatchButton" class="w-50 text-gray-300 bg-gray-800 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_MATCH%%</button>
					<button id="remoteTournamentButton" class="w-50 text-gray-300 bg-gray-800 cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_TOURNAMENT%%</button>
				</fieldset>
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
