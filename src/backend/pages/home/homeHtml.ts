import { translateBackend } from "../../translations.js";

/*
	The HTML returned to the browser. Replace any placeholders here
*/
export function homeHtml({ user, language }): string {
	let html = homeString(user);
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["TITLE"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%HOME_${text}_TEXT%%`, translateBackend({
			language,
			text: `HOME_${text}_TEXT`
		}));
	});

	return html;
}

/*
	The HTML that represents the home page
*/
function homeString(user: any): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<div class="text-gray-300 pt-4 mb-4 text-4xl">%%HOME_TITLE_TEXT%%</div>
		<div class="grid grid-cols-2 gap-5 mt-12">
			<div class="flex flex-col justify-between">
				<button id="wipeAllButton"
					class="mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Wipe and recreate db
				</button>
				<button id="wipeUsersButton"
					class="mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Wipe users
				</button>
				<button id="wipeHistoryButton"
					class="mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Wipe history
				</button>
				<button id="wipeFriendsButton"
					class="mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Wipe friends
				</button>
				<button id="wipeTournamentsButton"
					class="mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Wipe tournaments
				</button>
				<button id="wipeMessagesButton"
					class="mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Wipe messages
				</button>
			</div>
			<div class="flex flex-col justify-between">
				<button id="addMockUsersButton"
					class="block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
					Add mock users
				</button>
				<button id="addMockHistoryButton"
					class="block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
					Add mock history
				</button>
				<button id="addMockFriendsButton"
					class="block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
					Add mock friends
				</button>
				<button id="addMockMessagesButton"
					class="block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
					Add mock messages
				</button>
			</div>
		</div>
	</div>
	`;
}
