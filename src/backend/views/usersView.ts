import { Foe, Friend, User, UserType } from "../../common/interfaces.js";

export function usersView(users: User[], friends: Friend[], foes: Foe[], user: User): string {
	if (0 == users.length) {
		return `
		<div class="w-full h-full bg-gray-900">
			<div class="text-gray-300 pt-8 text-center">%%TEXT_NO_USERS%%</div>
		</div>
		`;
	}

	const friendsIds = friends.map(friend => friend.friendId);
	const foeIds = foes.map(foe => foe.foeId);
	return usersViewHtml(users, friendsIds, foeIds, user);
}

/*
	The list of user buttons
*/
export function usersHtml(users: User[], friendsIds: number[], foesIds: number[], user: User) {
	let userList = "";
	for (var key in users) {
		var userId = users[key].userId;
		userList += userHtml(users[key], friendsIds.includes(userId), foesIds.includes(userId), UserType.GUEST == user.userType);
	}

	return userList;
}


function usersViewHtml(users: User[], friendsIds: number[], foesIds: number[], user: User): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="grow bg-gray-900">
				<div class="flex flex-col h-full py-8 pl-8 text-center">
					${switcherHtml(user)}
					<div class="h-150 p-2 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
						${usersHtml(users, friendsIds, foesIds, user)}
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
			<div class="disabled p-2 rounded-lg text-gray-600 bg-gray-800">All</div>
			<div id="friendsButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">Friends</div>
			<div id="foesButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">Foes</div>
		</div>
	`;
}

function userHtml(user: User, isFriend: boolean, isFoe: boolean, isGuest: boolean) {
	return `
		<div class="w-8/10 border border-gray-600 rounded-lg flex flex-row bg-gray-700 mx-auto p-2">
			<div class="text-white w-60 text-end">${user.nick}</div>
			<button class="viewProfileButton" data-id="${user.userId}"><i class="text-white cursor-pointer fa solid fa-user"></i></button>
			<button class="inviteButton" data-id="${user.userId}"><i class="text-white cursor-pointer fa-solid fa-table-tennis-paddle-ball"></i></button>
			${guestHtml(isGuest || UserType.GUEST == user.userType, user)}
			${neitherFriendNorFoeHtml(isFriend || isFoe, user)}
		</div>
	`;
}

function guestHtml(isGuest: boolean, user: User): string {
	if (isGuest)
		return "";

	return `
		<button class="chatButton" data-id="${user.userId}"><i class="text-white cursor-pointer fa solid fa-comment"></i></button>
	`;
}

function neitherFriendNorFoeHtml(isFriendOrFoe: boolean, user: User): string {
	if (isFriendOrFoe)
		return "";

	return `
		<button class="addFriendButton" data-id="${user.userId}"><i class="text-green-300 cursor-pointer fa solid fa-plus"></i></button>
		<button class="addFoeButton" data-id="${user.userId}"><i class="text-red-300 cursor-pointer fa solid fa-ban"></i></button>
	`;
}

