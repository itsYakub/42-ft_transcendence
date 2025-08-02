import { translateBackend } from "../translations.js";

/*
	The HTML returned to the browser. Replace any placeholders here
*/
export function homeHtml({ user, language }): string {
	let html = homeString();
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
function homeString(): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<div class="text-white pt-4 mb-4 text-4xl">%%HOME_TITLE_TEXT%%</div>
		<button id="wipeAllButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe and recreate db
		</button>
		<button id="wipeUsersButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe users
		</button>
		<button id="wipeMatchesButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe matches
		</button>
		<button id="wipeFriendsButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe friends
		</button>
		<button id="wipeTournamentsButton"
			class="mt-4 mx-auto block cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
			Wipe tournaments
		</button>
		<button id="addMockUsersButton"
			class="mt-4 block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
			Add mock users
		</button>
		<button id="addMockMatchesButton"
			class="mt-4 block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
			Add mock matches
		</button>
		<button id="addMockFriendsButton"
			class="mt-4 block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
			Add mock friends
		</button>
	</div>
	`;
}
