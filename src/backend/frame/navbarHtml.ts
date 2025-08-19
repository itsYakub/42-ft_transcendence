import { alertString, totpString } from "./dialogsHtml.js";
import { translateBackend } from "../translations.js";

export function navbarHtml({ user, language, page }): string {
	let languageSelect = englishString();

	switch (language) {
		case "dutch":
			languageSelect = dutchString();
			break;
		case "polish":
			languageSelect = polishString();
			break;
	}

	let html: string = alertString();

	if (!user)
		html += loggedOutString(languageSelect);
	else
		html += "guest" == user.type ? guestString(user, languageSelect, page) : loggedInString(user, languageSelect, page);

	html = translate(html, language);
	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["HOME", "GAME", "TOURNAMENT", "LOGIN", "REGISTER", "REGISTER_TITLE",
		"LOGIN_TITLE", "NICK", "EMAIL", "PASSWORD", "TOTP_CODE_TITLE", "TOTP_CODE", "TOTP_CODE_VERIFY",
		"PLAYER_NAME_TITLE", "PLAYER_NAME", "PLAYER_NAME_SET"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%NAVBAR_${text}_TEXT%%`, translateBackend({
			language,
			text: `NAVBAR_${text}_TEXT`
		}));
	});

	return html;
}

function loggedOutString(languageSelect: string): string {
	return `
	<div class="h-full bg-gray-800">
		<div class="h-full w-200 mx-auto flex flex-row items-center">
			<div class="ml-auto text-gray-300">
				<select id="languageSelect">
					${languageSelect}
				</select>
			</div>
		</div>
	</div>
	${totpString()}
	`;
}

function loggedInString(user: any, languageSelect: string, page: string): string {
	return `
	<div class="h-full bg-gray-800">
		<div class="h-full w-200 mx-auto flex flex-row items-center">
			<div class="mr-auto">
				<img id="profileAvatar" class="rounded-lg mx-auto border border-gray-800 cursor-pointer h-20 w-20"
					src="${user.avatar}" />
			</div>

			<div class="mx-auto">
				${homeButtonString(page)}
				${gameButtonString(page)}	
			</div>

			<div class="ml-auto text-gray-300">
				<select id="languageSelect">
					${languageSelect}
				</select>
			</div>
		</div>
	</div>
	`;
}

function guestString(user: any, languageSelect: string, page: string): string {
	return `
	<div class="h-full bg-gray-800">
		<div class="h-full w-200 mx-auto flex flex-row items-center">
			<div class="mr-auto text-white">
				${user.nick}
			</div>

			<div class="mx-auto">
				${homeButtonString(page)}
				${gameButtonString(page)}				
			</div>

			<div class="ml-auto text-gray-300">
				<select id="languageSelect">
					${languageSelect}
				</select>
			</div>
		</div>
	</div>
	`;
}

function homeButtonString(page: string) {
	const bgColour = "/" == page ? "bg-gray-700" : "";

	return `
	<button id="homeButton"
		class="cursor-pointer text-left ${bgColour} text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
		%%NAVBAR_HOME_TEXT%%
	</button>
	`;
}

function gameButtonString(page: string) {
	const bgColour = "/game" == page ? "bg-gray-700" : "";

	return `
	<button id="gameButton"
		class="ml-2 cursor-pointer text-left ${bgColour} text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
		%%NAVBAR_GAME_TEXT%%
	</button>
	`;
}

function englishString(): string {
	return `
	<option class="bg-gray-800" value="english" selected>English</option>
	<option class="bg-gray-800" value="polish">Polski</option>
	<option class="bg-gray-800" value="dutch">Nederlands</option>
	`;
}

function polishString(): string {
	return `
	<option class="bg-gray-800" value="english">English</option>
	<option class="bg-gray-800" value="polish" selected>Polski</option>
	<option class="bg-gray-800" value="dutch">Nederlands</option>
	`;
}

function dutchString(): string {
	return `
	<option class="bg-gray-800" value="english">English</option>
	<option class="bg-gray-800" value="polish">Polski</option>
	<option class="bg-gray-800" value="dutch" selected>Nederlands</option>
	`;
}
