import { MatchResult, User, UserChatMessage } from "./interfaces.js";

/*
	The add/remove friend/foe buttons in the profile dialog
*/
export function profileActionbuttons(isfriend: boolean, isFoe: boolean, userId: number) {
	if (!(isfriend || isFoe))
		return `
		<div id="addFriendButton" data-id="${userId}" class="cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-700 border border-gray-700 font-medium rounded-lg px-2 py-1">%%BUTTON_ADD_FRIEND%%</div>
		<div id="addFoeButton" data-id="${userId}" class="cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-700 border border-gray-700 font-medium rounded-lg px-2 py-1">%%BUTTON_ADD_FOE%%</div>
		`;

	if (isfriend)
		return `
		<div id="removeFriendButton" data-id="${userId}" class="cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4">%%BUTTON_REMOVE_FRIEND%%</div>
		`;

	if (isFoe)
		return `
		<div id="removeFoeButton" data-id="${userId}" class="cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4">%%BUTTON_REMOVE_FOE%%</div>
		`;

	return "";
}


/*
	The list of all the chats between the user and partner
*/
export function userChatsMessages(chats: UserChatMessage[], partnerId: number): string {
	let chatHtml = "";
	chats.forEach(chat => chatHtml += chatString(chat.message, partnerId == chat.fromId));
	return chatHtml;
}

/*
	The chat message itself, blue for incoming, green for outgoing
*/
export function chatString(message: string, isPartner: boolean): string {
	return isPartner ?
	`
	<div class="text-gray-300 bg-blue-700 mr-auto px-4 py-2 rounded-lg">${message}</div>
	` :
	`
	<div class="text-gray-300 bg-green-700 ml-auto px-4 py-2 rounded-lg">${message}</div>
	`;
}


export function tournamentDetails() {
	return `
	<div>
		Semi-final
	</div>
	`;
}

export function localTournamentHtml(user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-4 text-4xl">%%TEXT_LOCAL_TOURNAMENT%%</h1>
		<div class="flex flex-col mx-auto text-center items-center content-center">
			<form id="localTournamentForm" class="w-75">
				<div class="text-gray-300 text-lg">${user.nick}</div>
				<input type="text" name="g2Nick" maxlength="25" required="true" placeholder="%%TEXT_PLAYER%% 2" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="text" name="g3Nick" maxlength="25" required="true" placeholder="%%TEXT_PLAYER%% 3" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="text" name="g4Nick" maxlength="25" required="true" placeholder="%%TEXT_PLAYER%% 4" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-[url(/images/pointer.png),pointer] text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%TEXT_START%%</button>
			</form>
		</div>
	</div>
	`;
}

export function profileView(matchResults: MatchResult[], isfriend: boolean, isFoe: boolean, profileUser: User, user: User): string {
	const actionButtons = profileUser.userId == user.userId ? "" : profileActionbuttons(isfriend, isFoe, profileUser.userId);
	return `
	<div class="w-120 h-120 flex flex-col p-2">
		<div id="closeProfileButton" class="mx-auto cursor-[url(/images/pointer.png),pointer]"><i class="text-white hover:text-gray-800 fa fa-xmark"></i></div>
		<div class="text-white mb-2 text-lg">${profileUser.nick}</div>
		<div id="actionButtonsContainer" class="flex flex-row mx-auto gap-4">
			${actionButtons}
		</div>
		<div class="my-2 grow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
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
