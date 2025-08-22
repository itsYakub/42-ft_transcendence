/*
	The HTML returned to the browser. Replace any placeholders here
*/
export function homeHtml({ user, language }): string {
	let html = homeString(user);

	return html;
}

/*
	The HTML that represents the home page
*/
function homeString(user: any): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<div class="text-gray-300 pt-4 mb-4 text-4xl">%%TEXT_WELCOME%%</div>
		<div class="grid grid-cols-1 mt-12">
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
