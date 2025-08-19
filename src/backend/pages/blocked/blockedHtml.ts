export function blockedHtml(friends: any, { user }): string {
	let friendList = "";
	for (var key in friends) {
		friendList += blockedUserString(friends[key]);
	}

	return blockedString(user, friendList);
}

function blockedString(user: any, friendlist: string): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8 gap-4">
					<button id="profileButton"
						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_PROFILE%%</button>
					<button id="historyButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_HISTORY%%</button>
					<button id="usersButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_USERS%%</button>
					<button id="friendsButton"
						class="text-right w-full text-gray-300 p-2 rounded-lg hover-gray-800">%%BUTTON_FRIENDS%%</button>					
					<button id="blockedButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_BLOCKED%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 overflow-auto">
						${friendlist}
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function blockedUserString(friend: any): string {
	const onlineString: string = 1 == friend.Online ? `<div><i class="text-green-300 fa-solid fa-circle"></i></div>` : `<div><i class="text-red-300 fa-solid fa-circle"></i></div>`;
	return `
	<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-gray-300">
		<div class="flex flex-row gap-4">
			<div>${friend.Nick}</div>
			<div class="text-right my-auto grow">
				<button class="removeBlockedButton cursor-pointer" data-id="${friend.FriendID}"></data><div><i class="text-red-300 fa-solid fa-minus"></i></div></button>
			</div>
		</div>
	</div>
	`;
}
