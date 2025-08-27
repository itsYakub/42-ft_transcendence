import { Tournament, TournamentGamer, User } from "../../common/interfaces.js";

export function activeMatchHtml(tournament: Tournament, user: User): string {
	const gamer = whichGamerIsUser(tournament, user);
	const gamerStrings = [
		gamerString(tournament.primaryMatch.gamer1),
		gamerString(tournament.primaryMatch.gamer2)
	];
	let otherStrings = [
		`<div class="text-gray-300 text-center">${tournament.secondaryMatch.gamer1.nick}</div>`,
		`<div class="text-gray-300 text-center">${tournament.secondaryMatch.gamer2.nick}</div>`
	];

	const html = `
	<div class="flex flex-col gap-2">
		${gamerStrings[0]}
		<div class="text-white text-center">Vs</div>
		${gamerStrings[1]}
	</div>
	<form id="tournamentMatchReadyForm">
		<div class="flex flex-row justify-between mr-9">
			${readyButtonString(gamer, user)}
			<button id="leaveTournamentButton" type="submit" class="text-gray-300 mt-4 bg-red-600 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
		</div>
	</form>
	<div class="flex flex-col gap-2 mt-2">
		${otherStrings[0]}
		<div class="text-white text-center">Vs</div>
		${otherStrings[1]}
	</div>
	<div id="finishMatchButton" class="text-white mt-2">Finish match</div>
	`;

	return html;
}

function whichGamerIsUser(tournament: Tournament, user: User): TournamentGamer {
	if (tournament.primaryMatch.gamer1.userId == user.userId)
		return tournament.primaryMatch.gamer1;
	if (tournament.primaryMatch.gamer2.userId == user.userId)
		return tournament.primaryMatch.gamer2;
	if (tournament.secondaryMatch.gamer1.userId == user.userId)
		return tournament.secondaryMatch.gamer1;
	return tournament.secondaryMatch.gamer2;
}

function gamerString(gamer: TournamentGamer) {
	const readyText = gamer.ready ? `<i class="fa-solid fa-check text-green-300 my-auto"></i>` : `<i class="fa-solid fa-xmark text-red-300 my-auto"></i>`;

	return `
	<div class="flex flex-row mr-2">
		<div class="w-60 py-2 mr-2 border border-gray-700 rounded-lg text-gray-400 text-center">${gamer.nick}</div>
		${readyText}
	</div>
	`;
}

function readyButtonString(gamer: TournamentGamer, user: User) {
	return gamer.ready ? `<button type="submit" disabled class="text-gray-300 mt-4 bg-gray-800 block py-1 px-4 rounded-lg">%%BUTTON_READY%%</button>` :
		`<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700" data-id=${gamer.index} data-game=${user.gameId}>%%BUTTON_READY%%</button>`;
}
