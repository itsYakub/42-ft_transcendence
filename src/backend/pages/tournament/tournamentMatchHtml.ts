import { gameHtmlString } from '../game/game.js';
import { translateBackend } from '../../translations.js';

export function tournamentMatchHtml({ user, language, tournament }): string {
	if (tournament.error)
		return notFoundString();

	const m1String = match1String(tournament);
	const m2String = match2String(tournament);
	const final = finalString(tournament);
	const nextMatch = nextMatchString(tournament);

	let html = tournamentMatchHtmlString(tournament.code, m1String, m2String, final, nextMatch);
	html = translate(html, language);

	return html + gameHtmlString();
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["TITLE", "CODE", "SEMI_FINALS", "FINAL", "TBD", "NEXT_MATCH", "PLAY", "CONGRATULATIONS", "UNKNOWN"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%TOURNAMENT_${text}_TEXT%%`, translateBackend({
			language,
			text: `TOURNAMENT_${text}_TEXT`
		}));
	});

	return html;
}

function match1String(tournament: any): string {
	const p1Colour = tournament.m1p1Score > tournament.m1p2Score ? "green" : "red";
	const p2Colour = tournament.m1p1Score > tournament.m1p2Score ? "red" : "green";

	if (tournament.match > 0) {
		return `
		<div>
			<span class="text-${p1Colour}-300">${tournament.m1p1} ${tournament.m1p1Score}</span>
			<span class="text-gray-300"> : </span>
			<span class="text-${p2Colour}-300"> ${tournament.m1p2Score} ${tournament.m1p2}</span>
		</div>`;
	}

	return `<div class="text-white">${tournament.m1p1} vs ${tournament.m1p2}</div>`;
}

function match2String(tournament: any): string {
	const p1Colour = tournament.m2p1Score > tournament.m2p2Score ? "green" : "red";
	const p2Colour = tournament.m2p1Score > tournament.m2p2Score ? "red" : "green";

	if (tournament.match > 1) {
		return `
		<div>
			<span class="text-${p1Colour}-300">${tournament.m2p1} ${tournament.m2p1Score}</span>
			<span class="text-gray-300"> : </span>
			<span class="text-${p2Colour}-300"> ${tournament.m2p2Score} ${tournament.m2p2}</span>
		</div>`;
	}

	return `<div class="text-white">${tournament.m2p1} vs ${tournament.m2p2}</div>`;
}

function finalString(tournament: any): string {
	switch (tournament.match) {
		case 1:
			return `<div class="text-gray-300">${tournament.m3p1} vs %%TOURNAMENT_TBD_TEXT%%</div>`;
		case 2:
			return `<div class="text-gray-300">${tournament.m3p1} vs ${tournament.m3p2}</div>`;

		case 3:
			const p1Colour = tournament.m3p1Score > tournament.m3p2Score ? "green" : "red";
			const p2Colour = tournament.m3p1Score > tournament.m3p2Score ? "red" : "green";
			return `
				<div>
					<span class="text-${p1Colour}-300">${tournament.m3p1} ${tournament.m3p1Score}</span>
					<span class="text-gray-300"> : </span>
					<span class="text-${p2Colour}-300"> ${tournament.m3p2Score} ${tournament.m3p2}</span>
				</div>`;
		default:
			return `<div class="text-gray-300">%%TOURNAMENT_TBD_TEXT%% vs %%TOURNAMENT_TBD_TEXT%%</div>`;
	}
}

function tournamentMatchHtmlString(code: string, m1String: string, m2String: string, final: string, nextMatch: string): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-gray-300 pt-4 mb-2 text-4xl">%%TOURNAMENT_TITLE_TEXT%%</h1>
		<p class="text-gray-300">%%TOURNAMENT_CODE_TEXT%%: ${code}</p>
		<div>
			<h2 class="text-gray-300 text-xl my-4">%%TOURNAMENT_SEMI_FINALS_TEXT%%</h2>
			${m1String}
			${m2String}
			<h2 class="text-gray-300 text-xl my-4">%%TOURNAMENT_FINAL_TEXT%%</h2>
			${final}
			<div class="mt-8 border w-100 border-gray-400 rounded-lg p-4 mx-auto">
				<span class="text-gray-300">%%TOURNAMENT_NEXT_MATCH_TEXT%%</span>
				${nextMatch}
			</div>
		</div>
	</div>
	`;
}

function nextMatchString(tournament: any) {
	let p1: string;
	let p2: string;

	switch (tournament.match) {
		case 0:
			p1 = tournament.m1p1;
			p2 = tournament.m1p2;
			return `<div class="text-gray-300">${p1} vs ${p2}</div>${nextMatchButtonString(p1, p2)}`;
		case 1:
			p1 = tournament.m2p1;
			p2 = tournament.m2p2;
			return `<div class="text-gray-300">${p1} vs ${p2}</div>${nextMatchButtonString(p1, p2)}`;
		case 2:
			p1 = tournament.m3p1;
			p2 = tournament.m3p2;
			return `<div class="text-gray-300">${p1} vs ${p2}</div>${nextMatchButtonString(p1, p2)}`;
		default:
			p1 = tournament.m3p1Score > tournament.m3p2Score ? tournament.m3p1 : tournament.m3p2;
			return `<div class="text-gray-300">%%TOURNAMENT_CONGRATULATIONS_TEXT%% ${p1}!</div>`;
	}
}

function nextMatchButtonString(p1: string, p2: string) {
	return `
	<button id="nextMatchButton" data-p1="${p1}" data-p2="${p2}" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-pointer text-center p-2 rounded-lg hover:bg-gray-700">%%TOURNAMENT_GAME_TEXT%%!</button>
	`;
}

function notFoundString(): string {
	return `
	<div class="h-full bg-gray-900 content-center text-center">
		<div class="text-gray-300">%%TOURNAMENT_UNKNOWN_TEXT%%</div>
	</div>
	`;
}
