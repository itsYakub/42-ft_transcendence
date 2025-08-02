import { translateBackend } from "../translations.js";

export function friendHtml(friends: any, { user, language }): string {
	let friendList = "";
	for (var key in friends) {
		friendList += friendString(friends[key]);
	}

	let html = friendsString(friendList);
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["PROFILE", "MATCHES", "FRIENDS", "ONLINE", "OFFLINE", "REMOVE", "ADD_FRIEND"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%FRIENDS_${text}_TEXT%%`, translateBackend({
			language,
			text: `FRIENDS_${text}_TEXT`
		}));
	});

	return html;
}

function friendString(friend: any): string {
	const onlineString: string = 1 == friend.Online ? `<div class="text-green-300">%%FRIENDS_ONLINE_TEXT%%</div>` : `<div class="text-red-300">%%FRIENDS_OFFLINE_TEXT%%</div>`;
	return `
		<div class="border p-2.5 rounded-lg border-gray-700 m-3 bg-gray-800 text-white">
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

function friendsString(friendlist: string): string {
	return `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full w-200 m-auto text-center flex flex-row">
			<div class="w-50">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%FRIENDS_PROFILE_TEXT%%</button>
					<button id="matchesButton"
						class="my-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%FRIENDS_MATCHES_TEXT%%</button>
					<button id="friendsButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%FRIENDS_FRIENDS_TEXT%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="p-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 overflow-auto">
						${friendlist}
					</div>
					<div class="m-auto text-right">
						<button id="addFriendButton" class="border border-gray-700 p-2 cursor-pointer hover:bg-gray-700 rounded-lg text-white bg-gray-800">%%FRIENDS_ADD_FRIEND_TEXT%%</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}
