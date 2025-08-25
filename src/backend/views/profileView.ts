import { profileActionbuttons } from "../../common/dynamicElements.js";
import { MatchResult, User } from "../../common/interfaces.js";

export function profileView(matchResults: MatchResult[], isfriend: boolean, isFoe: boolean, user: User): string {
	return profileViewHtml(matchResults, isfriend, isFoe, user);
}

function profileViewHtml(matchResults: MatchResult[], isfriend: boolean, isFoe: boolean, user: User): string {
	return `
	<div class="w-full h-full flex flex-col p-2">
		<div id="closeProfileButton" class="mx-auto"><i class="text-white hover:text-gray-800 fa fa-xmark"></i></div>
		<div class="text-white mb-2">${user.nick}</div>
		<div id="actionButtonsContainer" class="flex flex-row mx-auto gap-4">
			${profileActionbuttons(isfriend, isFoe, user.userId)}
		</div>
		<div inert class="my-2 grow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
			${matchResultsString(matchResults)}
		</div>
		<div class="text-gray-300">
			${stats(matchResults)}
		</div>
	</div>
	`;
}

function matchResultsString(matchResults: MatchResult[]): string {
	let matchList = "";
	for (var key in matchResults) {
		matchList += matchResultString(matchResults[key]);
	}

	return matchList;
}

function matchResultString(matchResult: MatchResult): string {
	let colour: string;
	if (matchResult.opponentScore > matchResult.score)
		colour = "red";
	else
		colour = matchResult.tournamentWin ? "yellow" : "green";

	const date: Date = new Date(matchResult.playedAt);

	return `
	<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-white">
		<div class="flex flex-row gap-4">
			<div>${date.toLocaleDateString("pl-PL")}</div>
			<div class="grow text-${colour}-300">${matchResult.score} : ${matchResult.opponentScore} Vs ${matchResult.opponent}</div>
		</div>
	</div>
	`;
}

function stats(matchResults: MatchResult[]): string {
	let won: number = 0;
	let tournamentsWon: number = 0;
	for (var key in matchResults) {
		var match = matchResults[key];
		if (match.score > match.opponentScore)
			won++;
		if (match.tournamentWin)
			tournamentsWon++
	}

	const matchesReplacement = 1 == matchResults.length ? "%%TEXT_MATCH_SINGULAR%%" : "%%TEXT_MATCH_PLURAL%%";
	const tournamentsReplacement = 1 == tournamentsWon ? "%%TEXT_TOURNAMENT_SINGULAR%%" : "%%TEXT_TOURNAMENT_PLURAL%%";

	return `%%TEXT_WON%% ${won}/${matchResults.length} ${matchesReplacement} and ${tournamentsWon} ${tournamentsReplacement}!`;
}
