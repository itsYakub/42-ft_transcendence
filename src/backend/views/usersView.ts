import { User } from "../../common/interfaces.js";

export function usersView(users: User[], user: User): string {
	if (0 == users.length) {
		return `
		<div class="w-full h-full bg-gray-900">
			<div class="text-gray-300 pt-8 text-center">%%TEXT_NO_USERS%%</div>
		</div>
		`;
	}

	return usersViewHtml(users, user);
}

/*
	The list of user buttons
*/
export function usersHtml(users: User[]) {
	let userList = "";
	for (var key in users) {
		userList += userHtml(users[key]);
	}

	return userList;
}


function usersViewHtml(users: User[], user: User): string {
	return `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="grow bg-gray-900">
				<div class="flex flex-col h-full py-8 text-center">
					${switcherHtml()}
					<div class="userButton w-7/10 mx-auto cursor-pointer p-2 mb-4 mt-2 border border-gray-700 rounded-lg bg-gray-700 text-gray-300" data-id="${user.userId}">
						${user.nick}
					</div>
					<div class="h-150 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
						${usersHtml(users)}
					</div>					
				</div>
			</div>
		</div>
	</div>
	<dialog id="profileDialog" class="w-5/10 h-5/10 m-auto text-center content-center rounded-lg shadow border bg-gray-900 border-gray-100"></dialog>
	`;
}

function switcherHtml(): string {
	return `
		<div class="flex flex-row justify-center mb-2 gap-2">
			<div class="disabled p-2 rounded-lg text-gray-600 bg-gray-800">All</div>
			<div id="friendsButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">Friends</div>
			<div id="foesButton" class="cursor-pointer p-2 rounded-lg text-gray-600 hover:bg-gray-800">Foes</div>
		</div>
	`;
}

function userHtml(user: User) {
	return `
		<div class="userButton w-7/10 cursor-pointer border border-gray-700 rounded-lg bg-gray-800 text-gray-300 mx-auto p-2" data-id="${user.userId}">
			<div>${user.nick}</div>
		</div>
	`;
}
