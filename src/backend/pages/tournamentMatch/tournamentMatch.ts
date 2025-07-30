import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { frameAndContentHtml, frameHtml } from '../frame.js';
import { getUser, markUserOnline } from '../../user/userDB.js';
import { getTournamentByCode } from '../tournament/tournamentDB.js';
import { gameHtmlString } from '../game/game.js';

export function tournamentMatchPage(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/tournament/:id', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getUser(db, request.cookies.accessToken, request.cookies.refreshToken);
		const { id } = request.params as any;

		if (user.id)
			markUserOnline(db, user.id);

		const tournament = getTournamentByCode(db, id);

		const params = { user, tournament, page: "tournamentMatch", language: request.cookies.language ?? "english" };

		if (!request.headers["referer"]) {
			const frame = frameHtml(db, params);

			if (frame.error) {
				return reply.code(frame.code);
			}
			return reply.type("text/html").send(frame);
		}

		const frame = frameAndContentHtml(db, params);
		if (frame.error) {
			return reply.code(frame.code);
		}
		return reply.send(frame);
	});
}

export function tournamentMatchHtml(db: DatabaseSync, { user, language, tournament }): string {
	if (tournament.error)
		return notFoundHtmlString;

	let html = tournamentMatchHtmlString;

	html = html.replace("%%TOURNAMENT_CODE%%", tournament.code);
	html = html.replace("%%MATCH1%%", match1String(tournament));
	html = html.replace("%%MATCH2%%", match2String(tournament));
	html = html.replace("%%FINAL%%", finalString(tournament));
	html = html.replace("%%NEXTMATCH%%", nextMatchString(tournament));
 
	html += gameHtmlString;

	return html;
}

function match1String(tournament: any): string {
	const p1Colour = tournament.m1p1Score > tournament.m1p2Score ? "green" : "red";
	const p2Colour = tournament.m1p1Score > tournament.m1p2Score ? "red" : "green";

	if (tournament.match > 0) {
		return `
		<div>
			<span class="text-${p1Colour}-300">${tournament.m1p1} ${tournament.m1p1Score}</span>
			<span class="text-white"> : </span>
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
			<span class="text-white"> : </span>
			<span class="text-${p2Colour}-300"> ${tournament.m2p2Score} ${tournament.m2p2}</span>
		</div>`;
	}

	return `<div class="text-white">${tournament.m2p1} vs ${tournament.m2p2}</div>`;
}

function finalString(tournament: any): string {
	switch (tournament.match) {
		case 1:
			return `<div class="text-white">${tournament.m3p1} vs TBD</div>`;
		case 2:
			return `<div class="text-white">${tournament.m3p1} vs ${tournament.m3p2}</div>`;

		case 3:
			const p1Colour = tournament.m3p1Score > tournament.m3p2Score ? "green" : "red";
			const p2Colour = tournament.m3p1Score > tournament.m3p2Score ? "red" : "green";
			return `
				<div>
					<span class="text-${p1Colour}-300">${tournament.m3p1} ${tournament.m3p1Score}</span>
					<span class="text-white"> : </span>
					<span class="text-${p2Colour}-300"> ${tournament.m3p2Score} ${tournament.m3p2}</span>
				</div>`;
		default:
			return `<div class="text-white">TBD vs TBD</div>`;
	}
}

const tournamentMatchHtmlString: string = `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-2 text-5xl">Tournament</h1>
		<p class="text-white">Tournament code: %%TOURNAMENT_CODE%%</p>
		<div>
			<h2 class="text-white text-xl my-4">Semi-finals</h2>
			%%MATCH1%%
			%%MATCH2%%
			<h2 class="text-white text-xl my-4">Final</h2>
			%%FINAL%%
			<div class="mt-8 border w-100 border-gray-400 rounded-lg p-4 mx-auto">
				%%NEXTMATCH%%
			</div>
		</div>
	</div>`;


function nextMatchString(tournament: any) {
	let p1: string;
	let p2: string;

	switch (tournament.match) {
		case 0:
			p1 = tournament.m1p1;
			p2 = tournament.m1p2;
			return `<div class="text-white">${p1} vs ${p2}</div>${nextMatchButtonString(p1, p2)}`;
		case 1:
			p1 = tournament.m2p1;
			p2 = tournament.m2p2;
			return `<div class="text-white">${p1} vs ${p2}</div>${nextMatchButtonString(p1, p2)}`;
		case 2:
			p1 = tournament.m3p1;
			p2 = tournament.m3p2;
			return `<div class="text-white">${p1} vs ${p2}</div>${nextMatchButtonString(p1, p2)}`;
		default:
			p1 = tournament.m3p1Score > tournament.m3p2Score ? tournament.m3p1 : tournament.m3p2;
			return `<div class="text-white">Congratulations ${p1}!</div>`;
	}
}

function nextMatchButtonString(p1: string, p2: string) {
	return `<button id="nextMatchButton" data-p1="${p1}" data-p2="${p2}" class="text-white mt-4 bg-gray-800 block mx-auto cursor-pointer text-center p-2 rounded-lg hover:bg-gray-700">Play!</button>`;
}

const notFoundHtmlString: string = `
	<h1>Not found</h1>`;
