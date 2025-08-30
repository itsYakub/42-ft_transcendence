import { User, UserChatMessage } from "./interfaces.js";

/*
	The add/remove friend/foe buttons in the profile dialog
*/
export function profileActionbuttons(isfriend: boolean, isFoe: boolean, userId: number) {
	if (!(isfriend || isFoe))
		return `
		<div id="addFriendButton" data-id="${userId}" class="cursor-pointer text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4">%%BUTTON_ADD_FRIEND%%</div>
		<div id="addFoeButton" data-id="${userId}" class="cursor-pointer text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4">%%BUTTON_ADD_FOE%%</div>
		`;

	if (isfriend)
		return `
		<div id="removeFriendButton" data-id="${userId}" class="cursor-pointer text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4">%%BUTTON_REMOVE_FRIEND%%</div>
		`;

	if (isFoe)
		return `
		<div id="removeFoeButton" data-id="${userId}" class="cursor-pointer text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4">%%BUTTON_REMOVE_FOE%%</div>
		`;

	return "";
}


/*
	The list of all the chats between the user and partner
*/
export function userChatsMessages(chats: UserChatMessage[], partnerId: number): string {
	let chatHtml = "";
	chats.forEach(chat => chatHtml += chatString(chat.message, partnerId == chat.fromId));
	return chatHtml;
}

/*
	The chat message itself, blue for incoming, green for outgoing
*/
export function chatString(message: string, isPartner: boolean): string {
	return isPartner ?
	`
	<div class="text-gray-300 bg-blue-700 mr-auto px-4 py-2 rounded-lg">${message}</div>
	` :
	`
	<div class="text-gray-300 bg-green-700 ml-auto px-4 py-2 rounded-lg">${message}</div>
	`;
}


export function tournamentDetails() {
	return `
	<div>
		Semi-final
	</div>
	`;
}

export function localTournamentHtml(user: User): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<h1 class="text-white pt-4 mb-4 text-4xl">%%TEXT_LOCAL_TOURNAMENT%%</h1>
		<div class="flex flex-col mx-auto text-center items-center content-center">
			<form id="localTournamentForm" class="w-75">
				<div class="text-gray-300 text-lg">${user.nick}</div>
				<input type="text" name="g2Name" required="true" placeholder="%%TEXT_PLAYER%% 2" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="text" name="g3Name" required="true" placeholder="%%TEXT_PLAYER%% 3" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="text" name="g4Name" required="true" placeholder="%%TEXT_PLAYER%% 4" class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block mx-auto cursor-pointer text-center py-2 px-4 rounded-lg hover:bg-gray-700">%%TEXT_START%%</button>
			</form>
		</div>
	</div>
	`;
}
