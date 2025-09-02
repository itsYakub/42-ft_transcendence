import { LocalGamer, LocalMatch, LocalTournament, User } from '../../common/interfaces.js';
import { gameDialogHtml } from './dialogsView.js';

export function localTournamentView(tournament: LocalTournament, user: User): string {
	return `
	<div class="w-full h-full m-auto text-center flex flex-col items-center">
		<h1 class="text-gray-300 pt-4 mb-2 text-4xl">%%TEXT_LOCAL_TOURNAMENT%%</h1>
		<div class="flex flex-row items-center mt-8">
			<div class="flex flex-col gap-20">
				<fieldset class="w-70 h-40 border border-fuchsia-800 rounded-lg">
					<legend class="text-fuchsia-800">Semi-final</legend>
					<div class="flex flex-col gap-1 justify-center items-center">
						${matchHtml(tournament.matches[0])}
					</div>
				</fieldset>
				<fieldset class="w-70 h-40 border border-fuchsia-800 rounded-lg">
					<legend class="text-fuchsia-800">Semi-final</legend>
					<div class="flex flex-col gap-1 justify-center items-center">
						${matchHtml(tournament.matches[1])}
					<div>
				</fieldset>
			</div>
			<div class="border border-fuchsia-800 border-l-0 w-30 h-60"></div>
			<div class="border border-fuchsia-800 w-30 h-0.5"></div>
			<fieldset class="w-70 h-40 border border-fuchsia-800 rounded-lg">
				<legend class="text-fuchsia-800">Final</legend>
				<div class="flex flex-col gap-1 justify-center items-center">
					${matchHtml(tournament.matches[2])}
				</div>
			</fieldset>
		</div>
			
		<div class="mt-8 border border-fuchsia-800 rounded-lg p-4 px-8 mx-auto flex flex-row items-center justify-center">
			${nextMatchHtml(tournament)}
		</div>
	</div>
	${gameDialogHtml()}
	`;
}

function matchHtml(match: LocalMatch): string {
	let gamer1Colour: string;
	let gamer2Colour: string;

	if (0 == match.g1.score && 0 == match.g2.score) {
		gamer1Colour = "text-gray-300";
		gamer2Colour = "text-gray-300";
	}
	else if (match.g1.score > match.g2.score) {
		gamer1Colour = "text-green-300";
		gamer2Colour = "text-red-300";
	}
	else {
		gamer1Colour = "text-red-300";
		gamer2Colour = "text-green-300";
	}
	return `
		<div class="${gamer1Colour} text-lg">${match.g1.nick ?? "?"}</div>
		<span class="text-gray-300 text-lg">Vs</span>
		<div class="${gamer2Colour} text-lg">${match.g2.nick ?? "?"}</div>	
	`;
}

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
	return `<div class="text-green-300 text-lg">%%TEXT_CONGRATULATIONS%% ${winner}!</div>`;
}

function nextMatchButtonHtml(g1: LocalGamer, g2: LocalGamer, matchNumber: number) {
	return `
	<button id="nextTournamentMatchButton" data-g1="${g1.nick}" data-g2="${g2.nick}" data-match="${matchNumber}" class="text-gray-300 ml-8 bg-gray-800 cursor-[url(/images/pointer.png),pointer] text-center px-3 py-1 rounded-lg hover:bg-gray-700 text-lg">%%TEXT_TOURNAMENT_PLAY%%!</button>
	`;
}
