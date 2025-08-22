import { gameHtmlString } from "../game/game.js";

export function localMatchHtml({ user }): string {
	const p1String = gamer1String(user);
	let html = localMatchString(user, p1String);

	return html + gameHtmlString();
}

function gamer1String(user: any): string {
	if (user.error)
		return `<input type="text" name="p1Name" required="true" placeholder="%%TEXT_PLAYER%% 1" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">`;
	else
		return `<input type="text" name="p1Name" value="${user.nick}" disabled class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">`;
}

function localMatchString(user: any, p1String: string): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-4 text-4xl">%%TEXT_SINGLE_GAME%%</h1>
		<div class="flex flex-col mx-auto text-center items-center content-center">
			<form id="singleGameForm">
				<div class="grid grid-cols-2 gap-2 w-150">
					${p1String}
					<input type="text" name="p2Name" required="true" placeholder="%%TEXT_PLAYER%% 2" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
				</div>
				<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%TEXT_START%%</button>
			</form>
		</div>
	</div>
	`;
}
