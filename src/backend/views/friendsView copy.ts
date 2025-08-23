import { Friend, User } from "../../common/interfaces.js";

export function friendsView(friends: Friend[], user: User): string {
	let friendList = "";
	for (var key in friends) {
		friendList += friendHtml(friends[key]);
	}

	return friendsHtml(user, friendList);
}

function friendsHtml(user: User, friendlist: string): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8 gap-4">
					<button id="accountButton"
						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_ACCOUNT%%</button>
					<button id="historyButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_HISTORY%%</button>
					<button id="usersButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_USERS%%</button>
					<button id="friendsButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_FRIENDS%%</button>					
					<button id="foesButton"
						class="text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_FOES%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${friendlist}
					</div>
				</div>
			</div>
		</div>
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
