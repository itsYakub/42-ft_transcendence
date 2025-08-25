import { User } from "../../common/interfaces.js";

export function homeView(user: User): string {
	return `
	<span id="data" data-id="${user.userId}"></span>
	<div class="w-full h-full bg-gray-900 m-auto text-center">
		<div class="text-gray-300 pt-8 mb-4 text-4xl">%%TEXT_WELCOME%%</div>
		<div class="grid grid-cols-1 mt-16">
			<div class="flex flex-col justify-between">
				<button id="addMockHistoryButton"
					class="block mx-auto cursor-pointer text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
					Add mock history
				</button>
				<button id="deleteCookiesButton"
					class="mt-8 block mx-auto cursor-pointer text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Delete cookies
				</button>
			</div>
		</div>
	</div>
	`;
}
