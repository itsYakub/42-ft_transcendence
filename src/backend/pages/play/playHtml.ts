import { gameHtmlString } from "../game/game.js";
import { translateBackend } from "../translations.js";

export function playHtml({ user, language }): string {
	let html = playString();
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

function playString(): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-gray-300 pt-4 mb-8 text-4xl">Play</h1>
		<div class="flex flex-row mx-auto justify-center">
			<div class="flex flex-col gap-8">
				<p class="text-gray-300 text-2xl">Join...</p>
				<div class="flex flex-col border border-gray-700 rounded-lg grow gap-2 overscroll-contain overflow-auto"></div>
			</div>
			<div class="border border-gray-400 w-0.5"></div>
			<div class="flex flex-col gap-8">
				<p class="text-gray-300 text-2xl">Or create a new...</p>
				<button id="localMatchButton" class="w-50 text-white bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Local game</button>
				<button id="aiMatchButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">AI game</button>
				<button id="localTournamentButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Local tournament</button>
				<button id="remoteMatchButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Remote game</button>
				<button id="localTournamentButton" class="w-50 text-gray-300 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Remote tournament</button>
			</div>
		</div>
	</div>
	`;
}
