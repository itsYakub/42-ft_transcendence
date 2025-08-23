import { Foe, Friend, User, UserType } from "../../common/interfaces.js";

export function usersView(users: User[], friends: Friend[], foes: Foe[], selectedUser: User, user: User): string {
	if (0 == users.length) {
		return `
		<div class="w-full h-full bg-gray-900">
			<div class="text-gray-300 pt-8 text-center">%%TEXT_NO_USERS%%</div>
		</div>
		`;
	}

	const friendsIDs = friends.map(friend => friend.friendId);
	const foeIDs = foes.map(foe => foe.foeId);
	const isFriend = friendsIDs.includes(selectedUser.userId);
	const isFoe = foeIDs.includes(selectedUser.userId);

	return usersViewHtml(users, isFriend, isFoe, selectedUser, user);
}

/*
	The list of user buttons
*/
export function usersHtml(users: User[], selectedUser: User) {
	let userList = "";
	for (var key in users) {
		userList += userButtonHtml(users[key], selectedUser);
	}

	return userList;
}


function usersViewHtml(users: User[], isFriend: boolean, isFoe: boolean, selectedUser: User, user: User): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div id="usersDiv" class="w-60 pt-8 flex flex-col pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
				${switcherHtml(user)}	
				${usersHtml(users, selectedUser)}
			</div>
			<div class="grow bg-gray-900">
				<div class="flex flex-row h-full py-8 pl-8 text-left">
					<div class="h-150 p-2">
						${userHtml(selectedUser)}
						${friendHtml(isFriend)}
						${foeHtml(isFoe)}
						${neitherFriendNorFoeHtml(isFoe || isFriend)}
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
		<div class="flex flex-row justify-end mb-2 gap-2">
			<div class="disabled p-2 rounded-lg text-gray-600 bg-gray-800">All</div>
			<div id="friendsButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">Friends</div>
			<div id="foesButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">Foes</div>
		</div>
	`;
}

function userButtonHtml(user: User, selectedUser: User) {
	if (user.userId == selectedUser.userId) {
		return `
		<button id="selectedUserButton" class="disabled text-right w-full p-2 rounded-lg text-gray-600 bg-gray-800" data-id="${user.userId}">${user.nick}</button>
		`;
	}
	else {
		return `
		<button class="userButton cursor-pointer text-right w-full p-2 rounded-lg text-gray-600 hover:bg-gray-800" data-id="${user.userId}">${user.nick}</button>
		`;
	}
}

function userHtml(user: User) {
	return `
		<p class="text-gray-300 mb-8">${user.userType}</p>
	`;
}

function friendHtml(isFriend: boolean): string {
	if (!isFriend)
		return "";

	return `
		<div class="flex flex-row">
			<span class="text-white">In friends list - </span>
			<span id="removeFriendButton" class="cursor-pointer text-white">Remove</span>
		</div>
	`;
}

function foeHtml(isFoe: boolean): string {
	if (!isFoe)
		return "";

	return `
		<div class="flex flex-row">
			<span class="text-white">In foes list - </span>
			<span id="removeFoeButton" class="cursor-pointer text-white">Remove</span>
		</div>
	`;
}

function neitherFriendNorFoeHtml(isFriendOrFoe: boolean) {
	if (isFriendOrFoe)
		return "";

	return `
		<div class="flex flex-row">
			<span class="text-white">In neither list - </span>
			<button id="addFriendButton" class="cursor-pointer text-white">Add friend</button>
			<button id="addFoeButton" class="cursor-pointer text-white">Add foe</button>
		</div>
	`;
}

function friendOrFoeButtons(isFriendOrFoe: boolean) {
	if (isFriendOrFoe) {
		return `
		<button id="chatButton" class="visible"><i class="text-white cursor-pointer fa solid fa-comment"></i></button>
		<button id="addFriendButton" class="collapse"><i class="text-green-300 cursor-pointer fa solid fa-plus"></i></button>
		<button id="addFoeButton" class="collapse"><i class="text-red-300 cursor-pointer fa solid fa-ban"></i></button>
		`;
	}

	return `
		<button id="chatButton" class="collapse"><i class="text-white cursor-pointer fa solid fa-comment"></i></button>
		<button id="addFriendButton" class="visible"><i class="text-green-300 cursor-pointer fa solid fa-plus"></i></button>
		<button id="addFoeButton" class="visible"><i class="text-red-300 cursor-pointer fa solid fa-ban"></i></button>
	`;
}

function chatButtonHtml(isGuest): string {
	return isGuest ? "" : `
		<button id="chatButton"><i class="text-white cursor-pointer fa solid fa-comment"></i></button>
	`;
}

function friendButtonHtml(isFriend: boolean): string {
	return isFriend ? "" : `
		<button id="addFriendButton"><i class="text-green-300 cursor-pointer fa solid fa-plus"></i></button>
		`;
}

function foeButtonHtml(isFoe: boolean): string {
	return isFoe ? "" : `
		<button id="addFoeButton"><i class="text-red-300 cursor-pointer fa solid fa-ban"></i></button>
		`;
}

