import { alertString, totpString } from "./dialogsHtml.js";
import { translateBackend } from "./translations.js";

export function navbarHtml({ user, language }): string {
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
		html += "guest" == user.type ? guestString(user, languageSelect) : loggedInString(user, languageSelect);

	html = translate(html, language);
	return html;
}

function alertString2(): string {
	return `	
	<div id="alertBanner" class="absolute mx-auto mt-20 rounded-lg shadow border w-120 bg-gray-900 border-gray-100 p-2">
		<div>
			<h1 class="text-xl font-bold text-white text-center">
				Transcendence
			</h1>
			<p id="alertContent" class="text-gray-400 text-center text-wrap"></p>
			<button id="closeAlertButton"
				class="float-right cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg px-4 py-2">OK</button>
		</div>
	</div>
	`;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["HOME", "PLAY", "TOURNAMENT", "LOGIN", "OR", "REGISTER", "REGISTER_TITLE",
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

function loggedInString(user: any, languageSelect: string): string {
	return `
	<div class="h-full bg-gray-800">
		<div class="h-full w-200 mx-auto flex flex-row items-center">
			<div class="mr-auto">
				<img id="profileAvatar" class="rounded-lg mx-auto border border-gray-800 cursor-pointer h-20 w-20"
					src="${user.avatar}" />
			</div>

			<div class="mx-auto">
				<button id="homeButton"
					class="cursor-pointer text-left bg-%%HOME_COLOUR%% text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
					%%NAVBAR_HOME_TEXT%%
				</button>

				<button id="playButton"
					class="ml-2 cursor-pointer text-left bg-%%PLAY_COLOUR%% text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
					%%NAVBAR_PLAY_TEXT%%
				</button>
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

function guestString(user: any, languageSelect: string): string {
	return `
	<div class="h-full bg-gray-800">
		<div class="h-full w-200 mx-auto flex flex-row items-center">
			<div class="mr-auto text-white">
				${user.nick}
			</div>

			<div class="mx-auto">
				<button id="homeButton"
					class="cursor-pointer text-left bg-%%HOME_COLOUR%% text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
					%%NAVBAR_HOME_TEXT%%
				</button>

				<button id="playButton"
					class="ml-2 cursor-pointer text-left bg-%%PLAY_COLOUR%% text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700">
					%%NAVBAR_PLAY_TEXT%%
				</button>
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
