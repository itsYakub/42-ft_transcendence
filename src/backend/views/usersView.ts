import { User } from "../../common/interfaces.js";
import { profileDialogHtml } from "./dialogsView.js";

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


export function usersView(users: User[], user: User): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg border bg-gray-900 border-gray-900 px-3 py-1">%%TEXT_USERS_TITLE%%</div>
		${switcherHtml()}
		<div class="userButton w-80 mx-auto cursor-[url(/images/pointer.png),pointer] p-2 border border-gray-700 rounded-lg text-center bg-gray-700 text-gray-300" data-id="${user.userId}">${user.nick}</div>
		<div class="h-100 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
			${usersHtml(users)}
		</div>
	</div>
	${profileDialogHtml()}
	`;
}

function switcherHtml(): string {
	return `
		<div class="flex flex-row justify-center items-center mb-2 gap-2">
			<div class="disabled p-2 rounded-lg bg-fuchsia-800 text-gray-300 px-3 py-1">All</div>
			<div id="friendsButton" class="cursor-[url(/images/pointer.png),pointer] px-3 py-1 rounded-lg text-gray-900 hover:bg-gray-800">Friends</div>
			<div id="foesButton" class="cursor-[url(/images/pointer.png),pointer] px-3 py-1 rounded-lg text-gray-900 hover:bg-gray-800">Foes</div>
		</div>
	`;
}

function userHtml(user: User) {
	return `
		<div class="userButton w-80 cursor-[url(/images/pointer.png),pointer] border border-gray-700 rounded-lg bg-gray-800 text-center text-gray-300 mx-auto p-2" data-id="${user.userId}">${user.nick}</div>
	`;
}
