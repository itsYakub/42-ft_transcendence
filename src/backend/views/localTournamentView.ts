import { Match, Tournament, User } from '../../common/interfaces.js';
import { gameHtmlString } from '../game/game.js';

export function localTournamentView(tournament: Tournament, user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-gray-300 pt-4 mb-2 text-4xl">%%TEXT_TOURNAMENT%%</h1>
		<div>
			<h2 class="text-gray-300 text-xl my-4">%%TEXT_TOURNAMENT_SEMI_FINALS%%</h2>
			${matchString(tournament.matches[0])}
			${matchString(tournament.matches[1])}
			<h2 class="text-gray-300 text-xl my-4">%%TEXT_TOURNAMENT_FINAL%%</h2>
			${finalString(tournament.matches[2])}
			<div class="mt-8 border w-100 border-gray-400 rounded-lg p-4 mx-auto">
				<span class="text-gray-300">%%TEXT_TOURNAMENT_NEXT_MATCH%%</span>
				${nextMatchString(tournament)}
			</div>
		</div>
	</div>
	${gameHtmlString()}
	`;
}

function matchString(match: Match): string {
	if (match.g1.score > 0 || match.g2.score > 0) {
		const p1Colour = match.g1.score > match.g2.score ? "green" : "red";
		const p2Colour = match.g1.score > match.g2.score ? "red" : "green";

		return `
		<div>
			<span class="text-${p1Colour}-300">${match.g1.nick} ${match.g1.score}</span>
			<span class="text-gray-300"> : </span>
			<span class="text-${p2Colour}-300"> ${match.g2.nick} ${match.g2.score}</span>
		</div>`;
	}

	return `<div class="text-white">${match.g1.nick} vs ${match.g2.nick}</div>`;
}

function finalString(match: Match): string {
	const g1 = match.g1.nick ?? "%%TEXT_TOURNAMENT_TBD%%";
	const g2 = match.g2.nick ?? "%%TEXT_TOURNAMENT_TBD%%";

	if (match.g1.score > 0 || match.g2.score > 0) {
		const p1Colour = match.g1.score > match.g2.score ? "green" : "red";
		const p2Colour = match.g1.score > match.g2.score ? "red" : "green";

		return `
		<div>
			<span class="text-${p1Colour}-300">${match.g1.nick} ${match.g1.score}</span>
			<span class="text-gray-300"> : </span>
			<span class="text-${p2Colour}-300"> ${match.g2.nick} ${match.g2.score}</span>
		</div>`;
	}

	return `
	<div>
		<span class="text-gray-300">${g1}</span>
		<span class="text-gray-300"> : </span>
		<span class="text-gray-300"> ${g2}</span>
	</div>
	`;
}

function nextMatchString(tournament: Tournament) {
	const m1 = tournament.matches[0];
	const m2 = tournament.matches[1];
	const m3 = tournament.matches[2];

	if (0 == m1.g1.score && 0 == m1.g2.score)
		return `<div class="text-gray-300">${m1.g1.nick} vs ${m1.g2.nick}</div>${nextMatchButtonString(m1.g1.nick, m1.g2.nick)}`;

	if (0 == m2.g1.score && 0 == m2.g2.score)
		return `<div class="text-gray-300">${m2.g1.nick} vs ${m2.g2.nick}</div>${nextMatchButtonString(m2.g1.nick, m2.g2.nick)}`;

	if (0 == m3.g1.score && 0 == m3.g2.score)
		return `<div class="text-gray-300">${m3.g1.nick} vs ${m3.g2.nick}</div>${nextMatchButtonString(m3.g1.nick, m3.g2.nick)}`;

	const winner = m3.g1.score > m3.g2.score ? m3.g1.nick : m3.g2.nick;
	return `<div class="text-gray-300">%%TEXT_CONGRATULATIONS%% ${winner}!</div>`;
}

function nextMatchButtonString(p1: string, p2: string) {
	return `
	<button id="nextMatchButton" data-p1="${p1}" data-p2="${p2}" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-pointer text-center px-2 py-1 rounded-lg hover:bg-gray-700">%%TEXT_TOURNAMENT_PLAY%%!</button>
	`;
}
