import { translateBackend } from "../translations.js";

export function localTournamentHtml({ user, language }): string {
	const p1String = player1String(user);
	let html = tournamentString(user, p1String);
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["NEW", "PLAYER", "START"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%TOURNAMENT_${text}_TEXT%%`, translateBackend({
			language,
			text: `TOURNAMENT_${text}_TEXT`
		}));
	});

	return html;
}

function player1String(user: any): string {
	if (user.error)
		return `<input type="text" name="p1Name" required="true" placeholder="%%TOURNAMENT_PLAYER_TEXT%% 1" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">`;
	else
		return `<input type="text" name="p1Name" value="${user.nick}" disabled class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">`;
}

function tournamentString(user: any, player1String: string): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-4 text-4xl">%%TOURNAMENT_NEW_TEXT%%</h1>
		<div class="flex flex-col mx-auto text-center items-center content-center">
			<form id="newTournamentForm" class="w-75">
				${player1String}
				<input type="text" name="p2Name" required="true" placeholder="%%TOURNAMENT_PLAYER_TEXT%% 2" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="text" name="p3Name" required="true" placeholder="%%TOURNAMENT_PLAYER_TEXT%% 3" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="text" name="p4Name" required="true" placeholder="%%TOURNAMENT_PLAYER_TEXT%% 4" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%TOURNAMENT_START_TEXT%%</button>
			</form>
		</div>
	</div>
	`;
}
