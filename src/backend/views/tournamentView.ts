import { GameChatMessage, Match, MatchGamer, Tournament, User } from "../../common/interfaces.js";
import { gameHtmlString } from "../game/game.js";
import { messagesString } from "./lobbyView.js";

export function tournamentLobbyView(tournament: Tournament, chats: GameChatMessage[], user: User): string {
	console.log("chats here", chats);
	return `
	<div class="w-full h-full bg-gray-900 m-auto">
		<h1 class="text-white pt-4 mb-4 text-4xl text-center">%%TEXT_TOURNAMENT%%</h1>
		<div class="flex flex-row h-150">
			<div id="lobbyDetailsContainer" class="flex flex-col">
				<form id="gamerMatchReadyForm">
					${tournamentDetails(tournament, user)}
				</form>
			</div>
			<div class="grow border border-gray-700 rounded-lg p-2">				
				<div class="flex flex-col h-full">
					<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${messagesString(chats, user)}
					</div>
					<div class="mt-2">
						<form id="sendMatchMessageForm">
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

export function tournamentDetails(tournament: Tournament, user: User): string {
	if (isFinalFinished(tournament)) {
		return `
			<div class="text-white">All done!</div>
		`;
	}

	if (isFinalReady(tournament)) {
		return finalHtml(tournament.matches[2], user);
	}

	const match = whichMatchIsUserIn(tournament, user);
	const gamer = whichGamerIsUser(match, user);

	const html = `
	<div class="flex flex-col gap-2">
		${gamerString(match.g1)}
		<div class="text-white text-center">Vs</div>
		${gamerString(match.g2)}
	</div>
	<form id="tournamentMatchReadyForm">
		<div class="flex flex-row justify-between mr-9">
			${readyButtonString(gamer)}
			<button id="leaveTournamentButton" type="submit" class="text-gray-300 mt-4 bg-red-600 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
		</div>
	</form>
	<div class="flex flex-col gap-2 mt-2">
		${secondaryMatchHtml(tournament.matches[1 == match.matchNumber ? 1 : 0])}
	</div>
	<div id="finishMatchButton" class="text-white mt-2">Finish match</div>
	${gameHtmlString()}
	`;

	return html;
}

function secondaryMatchHtml(match: Match): string {
	const statusString = match.g1.ready && match.g2.ready ?
		"Playing" : "Waiting to start";

	return `
	<div class="text-gray-300 text-center">${match.g1.nick} : ${match.g1.score}</div>
	<div class="text-white text-center">Vs</div>
	<div class="text-gray-300 text-center">${match.g2.nick} : ${match.g2.score}</div>
	<div class="text-white text-center">${statusString}</div>
	`;
}

function whichMatchIsUserIn(tournament: Tournament, user: User): Match {
	return tournament.matches.find(match => match.g1.userId == user.userId || match.g2.userId == user.userId);
}

function whichGamerIsUser(match: Match, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g1 : match.g2;
}

function whichOpponentHasUser(match: Match, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g2 : match.g1;
}

function isFinalReady(tournament: Tournament): boolean {
	const match1Count = tournament.matches[0].g1.score + tournament.matches[0].g2.score;
	const match2Count = tournament.matches[1].g1.score + tournament.matches[1].g2.score;
	return match1Count > 0 && match2Count > 0;
}

function isFinalFinished(tournament: Tournament): boolean {
	return tournament.matches[2].g1.score + tournament.matches[2].g2.score > 0;
}

function finalHtml(match: Match, user: User): string {
	console.log(match);
	if (match.g1.userId == user.userId || match.g2.userId == user.userId)
		return `
			<div class="flex flex-col gap-2">
				${gamerString(match.g1)}
				<div class="text-white text-center">Vs</div>
				${gamerString(match.g2)}
			</div>
			<form id="tournamentMatchReadyForm">
				<div class="flex flex-row justify-between mr-9">
					${readyButtonString(whichGamerIsUser(match, user))}
					<button id="leaveTournamentButton" type="submit" class="text-gray-300 mt-4 bg-red-600 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
				</div>
			</form>
			${gameHtmlString()}
		`;
	else
		return `
		<div class="text-white">Not yours!</div>
	`;
}

function gamerString(gamer: MatchGamer) {
	const readyText = gamer.ready ? `<i class="fa-solid fa-check text-green-300 my-auto"></i>` : `<i class="fa-solid fa-xmark text-red-300 my-auto"></i>`;

	return `
	<div class="flex flex-row mr-2">
		<div class="w-60 py-2 mr-2 border border-gray-700 rounded-lg text-gray-400 text-center">${gamer.nick}</div>
		${readyText}
	</div>
	`;
}

function readyButtonString(gamer: MatchGamer) {
	return gamer.ready ? `<button type="submit" disabled class="text-gray-300 mt-4 bg-gray-800 block py-1 px-4 rounded-lg">%%BUTTON_READY%%</button>` :
		`<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_READY%%</button>`;
}
