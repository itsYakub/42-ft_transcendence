import { GameChatMessage, TournamentMatch, MatchGamer, Tournament, User } from "../../common/interfaces.js";
import { gameHtml } from "./dialogsView.js";
import { tournamentMessagesHtml } from "./tournamentLobbyView.js";

export function tournamentView(tournament: Tournament, chats: GameChatMessage[], user: User): string {
	const title = isFinalReady(tournament) ? "TEXT_TOURNAMENT_FINAL" : "TEXT_TOURNAMENT_SEMI_FINALS";
	return `
	<div class="w-full h-full bg-gray-900 m-auto">
		<h1 id="gameTitle" class="text-white pt-4 mb-4 text-3xl text-center">%%TEXT_TOURNAMENT%% - %%${title}%%</h1>
		<div class="flex flex-row h-150">
			<div id="tournamentDetailsContainer" class="flex flex-col w-69">
				${tournamentDetails(tournament, user)}
			</div>
			<div class="grow border border-gray-700 rounded-lg p-2">				
				<div class="flex flex-col h-full">
					<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${tournamentMessagesHtml(chats, user)}
					</div>
					<div class="mt-2">
						<form id="sendMatchMessageForm">
							<div class="flex flex-row gap-1">
								<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
								<input type="submit" hidden>
								<button type="submit" class="border border-gray-700 py-0.5 px-2 cursor-[url(/images/pointer.png),pointer] hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-gray-300 fa-solid fa-play"></i></button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	${gameHtml()}
	`;
}

export function tournamentDetails(tournament: Tournament, user: User): string {
	if (isFinalFinished(tournament.matches[2])) {
		const match = tournament.matches[2];
		const winner = match.g1.score > match.g2.score ? match.g1 : match.g2;
		return `
			<div class="text-white text-center">Winner - ${winner.nick}</div>
		`;
	}

	if (isFinalReady(tournament)) {
		return finalHtml(tournament.matches[2], user);
	}

	const match = whichMatchIsUserIn(tournament, user);
	const gamer = whichGamerIsUser(match, user);

	const html = `
	<div class="flex flex-col gap-2">
		${gamerHtml(match.g1)}
		<div class="text-white text-center">Vs</div>
		${gamerHtml(match.g2)}
	</div>
	<div class="flex flex-row justify-between mr-9">
		${readyButtonHtml(gamer)}
		<button id="leaveTournamentButton" class="text-gray-300 mt-4 bg-red-600 block cursor-[url(/images/pointer.png),pointer] py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
	</div>
	<div class="flex flex-col gap-2 mt-2 w-69">
		<div class="border border-gray-800 my-4 h-0.5 w-full mx-2"></div>
		<div class="text-gray-300 text-lg text-center mb-2">Other match</div>
		${secondaryMatchHtml(tournament.matches[1 == match.matchNumber ? 1 : 0])}
	</div>
	${gameHtml()}
	`;

	return html;
}

function secondaryMatchHtml(match: TournamentMatch): string {
	let statusString = "";
	let g1Score = "";
	let g2Score = "";
	if (!match.g1.ready || !match.g2.ready)
		statusString = "Waiting to start";
	else if (match.g1.ready && match.g2.ready) {
		if (0 == match.g1.score + match.g2.score) {
			statusString = "Playing";
		}
		else {
			statusString = "";
			g1Score = ` :  ${gamerScore(match.g1, match.g2)}`;
			g2Score = ` :  ${gamerScore(match.g2, match.g1)}`;
		}

	}

	return `
	<div class="text-gray-300 text-center font-bold">${match.g1.nick}${g1Score}</div>
	<div class="text-white text-center">Vs</div>
	<div class="text-gray-300 text-center font-bold">${match.g2.nick}${g2Score}</div>
	<div class="text-white text-center mt-2">${statusString}</div>
	`;
}

function gamerScore(gamer: MatchGamer, opponent: MatchGamer): string {
	return gamer.score > opponent.score ?
		`
	<span class="text-green-300">${gamer.score}</span>
	`
		:
		`
	<span class="text-red-300">${gamer.score}</span>
	`;
}

function whichMatchIsUserIn(tournament: Tournament, user: User): TournamentMatch {
	return tournament.matches.find(match => match.g1.userId == user.userId || match.g2.userId == user.userId);
}

function whichGamerIsUser(match: TournamentMatch, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g1 : match.g2;
}

function whichOpponentHasUser(match: TournamentMatch, user: User): MatchGamer {
	return match.g1.userId == user.userId ? match.g2 : match.g1;
}

function isFinalReady(tournament: Tournament): boolean {
	const match1Count = tournament.matches[0].g1.score + tournament.matches[0].g2.score;
	const match2Count = tournament.matches[1].g1.score + tournament.matches[1].g2.score;
	return match1Count > 0 && match2Count > 0;
}

function isFinalFinished(match: TournamentMatch): boolean {
	return match.g1.score + match.g2.score > 0;
}

function finalHtml(match: TournamentMatch, user: User): string {
	if (match.g1.userId == user.userId || match.g2.userId == user.userId)
		return `
			<div class="flex flex-col gap-2">
				${gamerHtml(match.g1)}
				<div class="text-white text-center">Vs</div>
				${gamerHtml(match.g2)}
			</div>
			<div class="flex flex-row justify-between mr-9">
				${readyButtonHtml(whichGamerIsUser(match, user))}
				<button id="leaveTournamentButton" class="text-gray-300 mt-4 bg-red-600 block cursor-[url(/images/pointer.png),pointer] py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
			</div>

			${gameHtml()}
		`;
	else
		return secondaryMatchHtml(match);
}

function gamerHtml(gamer: MatchGamer) {
	const readyText = gamer.ready ? `<i class="fa-solid fa-check text-green-300 my-auto"></i>` : `<i class="fa-solid fa-xmark text-red-300 my-auto"></i>`;

	return `
	<div class="flex flex-row mr-2">
		<div class="w-60 py-2 mr-2 border border-gray-700 rounded-lg text-gray-400 text-center">${gamer.nick}</div>
		${readyText}
	</div>
	`;
}

function readyButtonHtml(gamer: MatchGamer) {
	return gamer.ready ? `<button disabled class="text-gray-300 mt-4 bg-gray-800 block py-1 px-4 rounded-lg">%%BUTTON_READY%%</button>` :
		`<button id="tournamentGamerReadyButton" class="text-gray-300 mt-4 bg-gray-800 block cursor-[url(/images/pointer.png),pointer] py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_READY%%</button>`;
}
