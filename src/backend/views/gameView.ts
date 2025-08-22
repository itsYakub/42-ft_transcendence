import { Game, User } from "../../common/interfaces.js";
import { gameHtmlString } from "../game/game.js";

export function gameView(games: Game[], user: User): string {
	const gamesHtmlString = gamesString(games);
	let html = gameString(user, gamesHtmlString);

	return html + gameHtmlString();
}

function gameString(user: User, gamesHtmlString: string): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<div class="flex flex-row h-150 mx-auto justify-center pt-8">
			<div class="w-95 flex flex-col gap-8 px-8">
				<p class="text-gray-300 text-2xl">%%TEXT_JOIN%%</p>
				<div class="flex flex-col border p-2 border-gray-700 rounded-lg grow gap-2 overscroll-contain overflow-auto">
					${gamesHtmlString}
				</div>
			</div>
			<div class="w-95 flex flex-col gap-8">
				<p class="text-gray-300 text-2xl">%%TEXT_CREATE%%</p>
				<button id="localMatchButton" class="w-50 text-white bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LOCAL_GAME%%</button>
				<button id="aiMatchButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_AI_GAME%%</button>
				<button id="remoteMatchButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_REMOTE_GAME%%</button>
				<button id="localTournamentButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LOCAL_TOURNAMENT%%</button>
				<button id="remoteTournamentButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_REMOTE_TOURNAMENT%%</button>
			</div>
		</div>
	</div>
	`;
}

function gamesString(games): string {
	let gameStrings: string = "";

	games.forEach(game => {
		gameStrings += gameButtonString(game);
	});

	return gameStrings;
}

function gameButtonString(game: Game): string {
	const gameID: string = game.gameId;
	const gamers: string[] = game.nicks.split(",");
	if ((gameID.startsWith("t") && 4 == gamers.length) || (gameID.startsWith("m") && 2 == gamers.length))
		return "";

	const type = gameID.startsWith("t") ? "tournament" : "match";
	const title = gameID.startsWith("t") ? "%%TEXT_TOURNAMENT%%" : "%%TEXT_MATCH%%";
	let gamersString = "";
	gamers.forEach((name) => {
		gamersString += nameString(name);
	});

	return `
	<button class="joinGameButton w-full text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700" data-type="${type}" data-id="${gameID}"><span class="text-green-300">${title}</span>${gamersString}</button>
	`;
}

function nameString(gamer: string) {
	return `
	<div class="">${gamer}</div>
	`;
}
