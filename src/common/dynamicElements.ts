import { UserChatMessage } from "./interfaces.js";

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
