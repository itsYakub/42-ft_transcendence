import { FrameParams, User, UserType } from "../../common/interfaces.js";
import { alertDialogHtml, totpLoginDialogHtml } from "./dialogsView.js";

export function navbarView(params: FrameParams): string {
	let languageSelect = englishHtml();

	switch (params.language) {
		case "dutch":
			languageSelect = dutchHtml();
			break;
		case "polish":
			languageSelect = polishHtml();
			break;
	}

	let html: string = alertDialogHtml();

	if (!params.user)
		html += loggedOutHtml(languageSelect);
	else
		html += UserType.GUEST == params.user.userType ? guestHtml(params.user, languageSelect, params.page) : loggedInHtml(params.user, languageSelect, params.page);

	return html;
}

function loggedOutHtml(languageSelect: string): string {
	return `
	<div class="h-full bg-stone-700">
		<div class="h-full w-200 mx-auto flex flex-row items-center justify-between">
			<div class="mr-auto flex flex-row gap-4 items-center">
				<img class="h-20 w-20" src="/images/icon.png"/>
				<div class="text-5xl text-gray-300">Transcendence</div>
			</div>
			<select id="languageSelect" class="cursor-[url(/images/pointer.png),pointer] text-gray-300">
				${languageSelect}
			</select>
		</div>
	</div>
	${totpLoginDialogHtml()}
	`;
}

function loggedInHtml(user: User, languageSelect: string, page: string): string {
	return `
	<div class="h-full bg-stone-700">
		<div class="h-full w-200 mx-auto flex flex-row items-center justify-between">
			<img id="homeButton" class="cursor-[url(/images/pointer.png),pointer] h-20 w-20" src="/images/icon.png"/>

			<div class="flex flex-col items-center gap-2">
				<div class="text-gray-300">${user.nick}</div>
				<div class="flex flex-row gap-4">
					${accountButtonHtml(page)}
					${gameButtonHtml(page)}
					${usersButtonHtml(page)}
					${chatButtonHtml(page)}
				</div>
			</div>
			<select id="languageSelect" class="cursor-[url(/images/pointer.png),pointer] text-gray-300">
				${languageSelect}
			</select>
		</div>
	</div>
	`;
}

// TODO remove delete cookies button
function guestHtml(user: User, languageSelect: string, page: string): string {
	return `
	<div class="h-full bg-stone-700">
		<div class="h-full w-200 mx-auto flex flex-row items-center justify-between">
			<img id="homeButton" class="cursor-[url(/images/pointer.png),pointer] h-20 w-20" src="/images/icon.png"/>

			<div class="flex flex-col items-center gap-2">
				<div class="text-gray-300">${user.nick}</div>
				<button id="deleteCookiesButton"
					class="cursor-[url(/images/pointer.png),pointer] text-center text-red-600 p-2 rounded-lg hover:bg-gray-700">
					Delete cookies
				</button>	
			</div>				
				
			<select id="languageSelect" class="cursor-[url(/images/pointer.png),pointer] text-gray-300">
				${languageSelect}
			</select>
		</div>
	</div>
	`;
}

function accountButtonHtml(page: string) {
	const bgColour = "/account" == page ? "bg-stone-800" : "";

	return `
	<button id="accountButton"
		class="cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} text-gray-300 px-2 py-1 rounded-lg hover:bg-stone-800">
		%%BUTTON_ACCOUNT%%
	</button>
	`;
}

function gameButtonHtml(page: string) {
	const bgColour = "/game" == page ? "bg-stone-800" : "";

	return `
	<button id="gameButton"
		class="cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} text-gray-300 px-2 py-1 rounded-lg hover:bg-stone-800">
		%%BUTTON_GAME%%
	</button>
	`;
}

function usersButtonHtml(page: string) {
	const bgColour = "/users" == page ? "bg-stone-800" : "";

	return `
	<button id="usersButton"
		class="cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} text-gray-300 px-2 py-1 rounded-lg hover:bg-stone-800">
		%%BUTTON_USERS%%
	</button>
	`;
}

function chatButtonHtml(page: string, chatsWaiting: boolean = false) {
	const bgColour = "/chat" == page ? "bg-stone-800" : "";
	const textColour = chatsWaiting ? "text-green-300" : "text-gray-300";

	return `
	<button id="chatButton"
		class="cursor-[url(/images/pointer.png),pointer] text-left ${bgColour} ${textColour} px-2 py-1 rounded-lg hover:bg-stone-800">
		%%BUTTON_CHAT%%
	</button>
	`;
}

function englishHtml(): string {
	return `
	<option class="bg-gray-800" value="english" selected>English</option>
	<option class="bg-gray-800" value="dutch">Nederlands</option>
	<option class="bg-gray-800" value="polish">Polski</option>
	`;
}

function dutchHtml(): string {
	return `
	<option class="bg-gray-800" value="english">English</option>
	<option class="bg-gray-800" value="dutch" selected>Nederlands</option>
	<option class="bg-gray-800" value="polish">Polski</option>
	`;
}

function polishHtml(): string {
	return `
	<option class="bg-gray-800" value="english">English</option>
	<option class="bg-gray-800" value="dutch">Nederlands</option>
	<option class="bg-gray-800" value="polish" selected>Polski</option>
	`;
}
