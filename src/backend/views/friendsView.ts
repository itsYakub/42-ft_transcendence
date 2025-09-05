import { Friend } from "../../common/interfaces.js";

export function friendsView(friends: Friend[]): string {
	if (0 == friends.length) {
		return `
		<div class="flex flex-col items-center gap-4">
			<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg border bg-stone-700 border-gray-900 px-3 py-1">%%TEXT_USERS_TITLE%%</div>
			${switcherHtml()}
			<div class="text-gray-300 pt-8 text-center">%%TEXT_NO_FRIENDS%%</div>
		</div>
		`;
	}

	return friendsViewHtml(friends);
}

/*
	The list of user buttons
*/
export function friendsHtml(friends: Friend[]) {
	let userList = "";
	for (var key in friends) {
		userList += friendHtml(friends[key]);
	}

	return userList;
}


function friendsViewHtml(friends: Friend[]): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg border bg-stone-700 border-gray-900 px-3 py-1">%%TEXT_USERS_TITLE%%</div>
		${switcherHtml()}
		<div class="h-100 p-2 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
			${friendsHtml(friends)}
		</div>					
	</div>
	`;
}

function switcherHtml(): string {
	return `
		<div class="flex flex-row justify-center items-center mb-2 gap-2">
			<div id="allButton" class="cursor-[url(/images/pointer.png),pointer] px-3 py-1 rounded-lg text-gray-900 hover:bg-fuchsia-800">All</div>
			<div class="disabled p-2 rounded-lg text-gray-300 bg-fuchsia-800 px-3 py-1">Friends</div>
			<div id="foesButton" class="cursor-[url(/images/pointer.png),pointer] px-3 py-1 rounded-lg text-gray-900 hover:bg-fuchsia-800">Foes</div>
		</div>
	`;
}

function friendHtml(friend: Friend): string {
	const onlineString: string = friend.online ? `<div><i class="text-green-300 fa-solid fa-circle"></i></div>` :
		`<div><i class="text-red-300 fa-solid fa-circle"></i></div>`;

	return `
	<div class="friendButton w-7/10 border p-2.5 rounded-lg border-gray-700 mx-auto bg-gray-800 text-gray-300">
		<div class="flex flex-row gap-4">
			${onlineString}
			<div class="grow">${friend.nick}</div>
			<div class="ml-auto my-auto relative group">
				<button class="removeFriendButton cursor-[url(/images/pointer.png),pointer]" data-id="${friend.friendId}"><i class="text-red-300 fa-solid fa-minus"></i></button>
				<div class="absolute right-full top-1/2 transform hover:opacity-0 -translate-y-1/2 mr-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100">%%TEXT_REMOVE_FRIEND%%</div>
			</div>
		</div>
	</div>
	`;
}
