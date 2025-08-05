import { translateBackend } from "../translations.js";

export function matchHtml(matches: any, { user, language }): string {
	let matchList = "";
	for (var key in matches) {
		matchList += matchString(matches[key]);
	}

	const statsString = stats(matches);
	let html = matchesString(matchList, statsString);
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["PROFILE", "MATCHES", "FRIENDS", "WON", "MATCH_SINGULAR", "MATCH_PLURAL", "TOURNAMENT_SINGULAR", "TOURNAMENT_PLURAL"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%MATCHES_${text}_TEXT%%`, translateBackend({
			language,
			text: `MATCHES_${text}_TEXT`
		}));
	});

	return html;
}

function matchString(match: any): string {
	let colour: string;
	if (match.P2Score > match.Score)
		colour = "red";
	else
		colour = 1 == match.TournamentWin ? "yellow" : "green";

	const date: Date = new Date(match.PlayedAt);

	return `
		<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-white">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<div>${date.toLocaleDateString("pl-PL")}</div>
					<div class="text-${colour}-300">${match.Score} : ${match.P2Score} Vs ${match.P2Name}</div>
				</div>
			</div>
		</div>`;
}

function stats(matches: any): string {
	let won: number = 0;
	let tournamentsWon: number = 0;
	for (var key in matches) {
		var match = matches[key];
		if (match.Score > match.P2Score)
			won++;
		if (1 == match.TournamentWin)
			tournamentsWon++
	}

	const matchesReplacement = 1 == matches.length ? "%%MATCHES_MATCH_SINGULAR_TEXT%%" : "%%MATCHES_MATCH_PLURAL_TEXT%%";
	const tournamentsReplacement = 1 == tournamentsWon ? "%%MATCHES_TOURNAMENT_SINGULAR_TEXT%%" : "%%MATCHES_TOURNAMENT_PLURAL_TEXT%%";

	return `%%MATCHES_WON_TEXT%% ${won}/${matches.length} ${matchesReplacement} and ${tournamentsWon} ${tournamentsReplacement}!`;
}

function matchesString(matchList: string, statsString: string): string {
	return `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-50">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="cursor-pointer text-right w-full text-gray-300 hover:bg-gray-800 p-2 rounded-lg">%%MATCHES_PROFILE_TEXT%%</button>
					<button id="matchesButton"
						class="my-4 text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%MATCHES_MATCHES_TEXT%%</button>
					<button id="friendsButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%MATCHES_FRIENDS_TEXT%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="p-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 overflow-auto">
						${matchList}					
					</div>
					<div class="text-white text-center">
						${statsString}
					</div>
				</div>
			</div>
		</div>
	</div>
	`
};
