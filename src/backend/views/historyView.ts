export function historyView(matches: any, { user }): string {
	let matchList = "";
	for (var key in matches) {
		matchList += historyString(matches[key]);
	}

	const statsString = stats(matches);
	let html = matchesString(user, matchList, statsString);

	return html;
}

function historyString(match: any): string {
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

	const matchesReplacement = 1 == matches.length ? "%%TEXT_MATCH_SINGULAR%%" : "%%TEXT_MATCH_PLURAL%%";
	const tournamentsReplacement = 1 == tournamentsWon ? "%%TEXT_TEXT_SINGULAR%%" : "%%TEXT_TEXT_PLURAL%%";

	return `%%TEXT_WON%% ${won}/${matches.length} ${matchesReplacement} and ${tournamentsWon} ${tournamentsReplacement}!`;
}

function matchesString(user: any, matchList: string, statsString: string): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8 gap-4">
					<button id="profileButton"
						class="cursor-pointer text-right w-full text-gray-300 hover:bg-gray-800 p-2 rounded-lg">%%BUTTON_ACCOUNT%%</button>
					<button id="historyButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_HISTORY%%</button>
					<button id="friendsButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_FRIENDS%%</button>
					<button id="usersButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_USERS%%</button>
					<button id="foesButton"
						class="text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_FOES%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 text-left">
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
