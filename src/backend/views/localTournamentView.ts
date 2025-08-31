import { LocalGamer, LocalMatch, LocalTournament, Match, Tournament, User } from '../../common/interfaces.js';
import { gameHtmlString } from '../game/game.js';

// export function localTournamentView(tournament: Tournament, user: User): string {
// 	return `
// 	<div class="w-full h-full bg-gray-900 m-auto text-center">
// 		<h1 class="text-gray-300 pt-4 mb-2 text-4xl">%%TEXT_TOURNAMENT%%</h1>
// 		<div>
// 			<h2 class="text-gray-300 text-xl my-4">%%TEXT_TOURNAMENT_SEMI_FINALS%%</h2>
// 			${matchString(tournament.matches[0])}
// 			${matchString(tournament.matches[1])}
// 			<h2 class="text-gray-300 text-xl my-4">%%TEXT_TOURNAMENT_FINAL%%</h2>
// 			${finalString(tournament.matches[2])}
// 			<div class="mt-8 border w-100 border-gray-400 rounded-lg p-4 mx-auto">
// 				<span class="text-gray-300">%%TEXT_TOURNAMENT_NEXT_MATCH%%</span>
// 				${nextMatchString(tournament)}
// 			</div>
// 		</div>
// 	</div>
// 	${gameHtmlString()}
// 	`;
// }


export function localTournamentView(tournament: LocalTournament, user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center flex flex-col items-center">
		<h1 class="text-gray-300 pt-4 mb-2 text-4xl">%%TEXT_LOCAL_TOURNAMENT%%</h1>
		<div class="flex flex-row items-center mt-8">
			<div class="flex flex-col gap-20">
				<div class="w-70 h-40 border border-gray-400 rounded-lg flex flex-col gap-1 justify-center items-center">
					${matchHtml(tournament.matches[0])}
				</div>
				<div class="w-70 h-40 border border-gray-400 rounded-lg flex flex-col gap-1 justify-center items-center">
					${matchHtml(tournament.matches[1])}
				</div>
			</div>
			<div class="border border-gray-400 border-l-0 w-30 h-60"></div>
			<div class="border border-gray-400 w-30 h-0.5"></div>
			<div class="w-70 h-40 border border-yellow-300 flex flex-col rounded-lg gap-1 justify-center items-center">
				${matchHtml(tournament.matches[2])}
			</div>
		</div>
			
		<div class="mt-8 border border-gray-400 rounded-lg p-4 px-8 mx-auto flex flex-row items-center justify-center">
			<span class="text-gray-300 text-lg mr-2">%%TEXT_TOURNAMENT_NEXT_MATCH%%:</span>
			${nextMatchHtml(tournament)}
		</div>
	</div>
	${gameHtmlString()}
	`;
}

function matchHtml(match: LocalMatch): string {
	return `
		<div class="text-gray-300 text-lg">${match.g1.nick ?? "?"}</div>
		<span class="text-gray-300 text-lg">Vs</span>
		<div class="text-gray-300 text-lg">${match.g2.nick ?? "?"}</div>
		${matchScore(match)}		
	`;
}

function matchScore(match: LocalMatch): string {
	if (match.g1.score > 0 || match.g2.score > 0) {
		const g1Colour = match.g1.score > match.g2.score ? "green" : "red";
		const g2Colour = match.g1.score > match.g2.score ? "red" : "green";
		return `
		<div class="text-${g1Colour}-300">${match.g1.score}<span class="text-gray-300"> : </span><span class="text-${g2Colour}-300">${match.g2.score}</span></div>
		`;
	}

	return "";
}

// function finalHtml(tournament: LocalTournament): string {
// 	return `
// 	<div class="flex flex-row gap-2">
// 		${finalistHtml(tournament.matches[0])}
// 		<span class="text-gray-300"> Vs </span>
// 		${finalistHtml(tournament.matches[1])}
// 	</div>
// 	`;
// }

// function finalistHtml(match: LocalMatch): string {
// 	if (match.g1.score > 0 || match.g2.score > 0) {
// 		const gamerColour = match.g1.score > match.g2.score ? "green" : "red";
// 		const gamerNick = match.g1.score > match.g2.score ? match.g1.nick : match.g2.nick;
// 		const gamerScore = match.g1.score > match.g2.score ? match.g1.score : match.g2.score;
// 		return `
// 		<span class="text-${gamerColour}-300">${gamerNick} ${gamerScore}</span>
// 		`;
// 	}

// 	return `<span class="text-gray-300">?</span>`;
// }

function nextMatchHtml(tournament: LocalTournament) {
	const m1 = tournament.matches[0];
	const m2 = tournament.matches[1];
	const m3 = tournament.matches[2];

	if (0 == m1.g1.score && 0 == m1.g2.score)
		return `<div class="text-gray-300 text-lg">${m1.g1.nick} vs ${m1.g2.nick}</div>${nextMatchButtonHtml(m1.g1, m1.g2, 1)}`;

	if (0 == m2.g1.score && 0 == m2.g2.score)
		return `<div class="text-gray-300 text-lg">${m2.g1.nick} vs ${m2.g2.nick}</div>${nextMatchButtonHtml(m2.g1, m2.g2, 2)}`;

	if (0 == m3.g1.score && 0 == m3.g2.score)
		return `<div class="text-gray-300 text-lg">${m3.g1.nick} vs ${m3.g2.nick}</div>${nextMatchButtonHtml(m3.g1, m3.g2, 3)}`;

	const winner = m3.g1.score > m3.g2.score ? m3.g1.nick : m3.g2.nick;
	return `<div class="text-gray-300 text-lg">%%TEXT_CONGRATULATIONS%% ${winner}!</div>`;
}

function nextMatchButtonHtml(g1: LocalGamer, g2: LocalGamer, matchNumber: number) {
	return `
	<button id="nextTournamentMatchButton" data-g1="${g1.nick}" data-g2="${g2.nick}" data-match="${matchNumber}" class="text-gray-300 ml-8 bg-gray-800 cursor-pointer text-center px-3 py-1 rounded-lg hover:bg-gray-700 text-lg">%%TEXT_TOURNAMENT_PLAY%%!</button>
	`;
}
