import { Foe, Friend, User, UserType } from "../../common/interfaces.js";

export function friendsView(friends: Friend[], user: User): string {
	if (0 == friends.length) {
		return `
		<div class="w-full h-full bg-gray-900">
			<div class="text-gray-300 pt-8 text-center">%%TEXT_NO_USERS%%</div>
		</div>
		`;
	}

	return friendsViewHtml(friends, user);
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


function friendsViewHtml(friends: Friend[], user: User): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="grow bg-gray-900">
				<div class="flex flex-col h-full py-8 pl-8 text-center">
					${switcherHtml(user)}
					<div class="h-150 p-2 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
						${friendsHtml(friends)}
					</div>					
				</div>
			</div>
		</div>
	</div>
	`;
}

function switcherHtml(user: User): string {
	if (UserType.GUEST == user.userType)
		return "";

	return `
		<div class="flex flex-row justify-center mb-2 gap-2">
			<div id="allButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">All</div>
			<div class="disabled p-2 rounded-lg text-gray-600 bg-gray-800">Friends</div>
			<div id="foesButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">Foes</div>
		</div>
	`;
}

function friendHtml(friend: Friend): string {
	const onlineString: string = 1 == friend.online ? `<div><i class="text-green-300 fa-solid fa-circle"></i></div>` : `<div><i class="text-red-300 fa-solid fa-circle"></i></div>`;
	return `
	<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-gray-300">
		<div class="flex flex-row gap-4">
			<div>		
				${onlineString}
			</div>
			<div>${friend.nick}</div>
			<div class="grid grid-cols-3 ml-auto my-auto grow">
				<button class="viewProfileButton cursor-pointer" data-id="${friend.friendId}"></data><div><i class="text-white fa-solid fa-user"></i></div></button>
				<button class="inviteButton cursor-pointer" data-id="${friend.friendId}"></data><div><i class="text-white fa-solid fa-table-tennis-paddle-ball"></i></div></button>
				<button class="removeFriendButton cursor-pointer" data-id="${friend.friendId}"></data><div><i class="text-red-300 fa-solid fa-minus"></i></div></button>
			</div>
		</div>
	</div>
	`;
}
