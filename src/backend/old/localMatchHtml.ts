import { User } from "../../common/interfaces.js";
import { gameHtmlString } from "../game/game.js";

export function localMatchHtml(user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-4 text-4xl">%%TEXT_LOCAL_MATCH%%</h1>
		<div class="flex flex-col mx-auto text-center items-center content-center">
			<form id="localGameForm">
				<div class="grid grid-cols-2 gap-2 w-150">
					<input type="text" name="p1Name" value="${user.nick}" disabled class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
					<input value="player 2" type="text" name="p2Name" required="true" placeholder="%%TEXT_PLAYER%% 2" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
				</div>
				<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_READY%%</button>
			</form>
		</div>
		${gameHtmlString()}
	</div>
	`;
}
