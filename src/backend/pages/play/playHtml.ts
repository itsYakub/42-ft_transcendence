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
		<h1 class="text-white pt-4 mb-8 text-4xl">Play</h1>
		<div class="flex flex-row mx-auto h-80 justify-center">
			<div class="w-95 my-auto grid grid-rows-2 gap-8">
				<p class="text-white text-2xl">Single game</p>
				<button id="localMatchButton" class="w-50 text-white bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Local game</button>
				<button class="w-50 text-white bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Remote game</button>
			</div>
			<div class="inline-block border bg-gray-400 border-gray-400 w-0.5"></div>
			<div class="w-95 my-auto grid grid-rows-2 gap-8">
				<p class="text-white text-2xl">Tournament</p>
				<button id="localTournamentButton" class="w-50 text-white bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Local tournament</button>
				<button class="w-50 text-white bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">Remote tournament</button>
			</div>
		</div>
	</div>
	`;
}
