import { translateBackend } from "../translations.js";

export function friendsHtml(friends: any, { user, language }): string {
	let friendList = "";
	for (var key in friends) {
		friendList += friendString(friends[key]);
	}

	let html = friendsString(friendList) + addFriendString();
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["PROFILE", "MATCHES", "FRIENDS", "MESSAGES", "ONLINE", "OFFLINE", "REMOVE", "ADD_FRIEND", 
		"ADD_TITLE", "ADD_EMAIL"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%FRIENDS_${text}_TEXT%%`, translateBackend({
			language,
			text: `FRIENDS_${text}_TEXT`
		}));
	});

	return html;
}

function friendsString(friendlist: string): string {
	return `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%FRIENDS_PROFILE_TEXT%%</button>
					<button id="matchesButton"
						class="my-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%FRIENDS_MATCHES_TEXT%%</button>
					<button id="friendsButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%FRIENDS_FRIENDS_TEXT%%</button>
					<button id="messagesButton"
						class="mt-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%FRIENDS_MESSAGES_TEXT%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 overflow-auto">
						${friendlist}
					</div>
					<div class="m-auto text-right">
						<button id="addFriendButton" class="border border-gray-700 p-2 cursor-pointer hover:bg-gray-700 rounded-lg text-gray-300 bg-gray-800">%%FRIENDS_ADD_FRIEND_TEXT%%</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function friendString(friend: any): string {
	const onlineString: string = 1 == friend.Online ? `<div class="text-green-300">%%FRIENDS_ONLINE_TEXT%%</div>` : `<div class="text-red-300">%%FRIENDS_OFFLINE_TEXT%%</div>`;
	return `
		<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-gray-300">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<div>${friend.Nick}</div>
					${onlineString}
				</div>
				<div class="text-right my-auto">
					<button class="removeFriendButton cursor-pointer text-red-300" data-id="${friend.FriendID}"></data>%%FRIENDS_REMOVE_TEXT%%</button>
				</div>
			</div>
		</div>`;
}

function addFriendString(): string {
	return `
	<dialog id="addFriendDialog" class="px-4 pt-2 backdrop:bg-black backdrop:opacity-70 m-auto content-center rounded-lg shadow border w-100 bg-gray-900 border-gray-100 text-center items-center">
		<div>
			<h1 class="text-xl font-bold text-gray-300">
				%%FRIENDS_ADD_TITLE_TEXT%%
			</h1>
			<form id="addFriendForm">
				<div>
					<input type="email" placeholder="%%FRIENDS_ADD_EMAIL_TEXT%%" name="email"
						class="my-2 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300"
						required="true">
				</div>
				<input type="submit" class="hidden" />

				<div class="grid grid-cols-2 justify-between my-4">
					<button id="cancelAddFriendButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-10 h-10 rounded-full my-auto">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<button type="submit" formmethod="post"
						class="ml-auto cursor-pointer text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-2 py-2">%%FRIENDS_ADD_FRIEND_TEXT%%</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}
