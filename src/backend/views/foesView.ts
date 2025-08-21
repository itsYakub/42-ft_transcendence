export function foesView(blocked: any, { user }): string {
	let blockedList = "";
	for (var key in blocked) {
		blockedList += blockedUserString(blocked[key]);
	}

	return blockedString(user, blockedList);
}

function blockedString(user: any, blockedList: string): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8 gap-4">
					<button id="profileButton"
						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_ACCOUNT%%</button>
					<button id="historyButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_HISTORY%%</button>
					<button id="usersButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_USERS%%</button>
					<button id="friendsButton"
						class="text-right w-full text-gray-300 p-2 rounded-lg hover-gray-800">%%BUTTON_FRIENDS%%</button>					
					<button id="foesButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_FOES%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
						${blockedList}
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function blockedUserString(blocked: any): string {
	return `
	<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-gray-300">
		<div class="flex flex-row gap-4">
			<div>${blocked.Nick}</div>
			<div class="text-right my-auto grow">
				<button class="removeBlockedButton cursor-pointer" data-id="${blocked.BlockedID}"></data><div><i class="text-red-300 fa-solid fa-minus"></i></div></button>
			</div>
		</div>
	</div>
	`;
}
