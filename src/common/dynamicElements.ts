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
