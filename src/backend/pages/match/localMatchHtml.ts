import { gameHtmlString } from "../game/game.js";
import { translateBackend } from "../translations.js";

export function localMatchHtml({ user, language }): string {
	const p1String = player1String(user);
	let html = localMatchString(user, p1String);
	html = translate(html, language);

	return html + gameHtmlString();
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["SINGLE_GAME", "PLAYER", "START"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%PLAY_${text}_TEXT%%`, translateBackend({
			language,
			text: `PLAY_${text}_TEXT`
		}));
	});

	return html;
}

function player1String(user: any): string {
	if (user.error)
		return `<input type="text" name="p1Name" required="true" placeholder="%%PLAY_PLAYER_TEXT%% 1" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">`;
	else
		return `<input type="text" name="p1Name" value="${user.nick}" disabled class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">`;
}

function localMatchString(user: any, p1String: string): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-4 text-4xl">%%PLAY_SINGLE_GAME_TEXT%%</h1>
		<div class="flex flex-col mx-auto text-center items-center content-center">
			<form id="singleGameForm">
				<div class="grid grid-cols-2 gap-2 w-150">
					${p1String}
					<input type="text" name="p2Name" required="true" placeholder="%%PLAY_PLAYER_TEXT%% 2" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
				</div>
				<p class="mt-2 text-gray-300">All customisation options should be put here</p>
				<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%PLAY_START_TEXT%%</button>
			</form>
		</div>
	</div>
	`;
}
