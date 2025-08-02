import { translateBackend } from "./translations.js";

export function navbarHtml({ user, language }): string {
	const loggedIn = !user.error;
	let languageSelect = englishString();

	switch (language) {
		case "dutch":
			languageSelect = dutchString();
			break;
		case "polish":
			languageSelect = polishString();
			break;
	}

	let html: string = alertString() + shimString() + alertShimString();

	if (loggedIn)
		html += loggedInString(user, languageSelect);
	else
		html += loggedOutString(languageSelect) + loginString() + registerString()

	html = translate(html, language);
	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["HOME", "PLAY", "TOURNAMENT", "LOGIN", "OR", "REGISTER", "REGISTER_TITLE",
		"LOGIN_TITLE", "NICK", "EMAIL", "PASSWORD", "CANCEL"];

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
			<div class="mr-auto">
				<button id="loginButton"
					class="cursor-pointer rounded-lg p-2 bg-%%COLOUR%% hover:bg-gray-700 group text-gray-300">%%NAVBAR_LOGIN_TEXT%%</button>
				<span class="mx-2 text-white">%%NAVBAR_OR_TEXT%%</span>
				<button id="registerButton"
					class="cursor-pointer rounded-lg p-2 bg-gray-900 hover:bg-gray-700 group text-gray-300">%%NAVBAR_REGISTER_TEXT%%</button>
			</div>

			<div class="mx-auto">
				<button id="homeButton"
					class="cursor-pointer text-left bg-%%HOME_COLOUR%% text-gray-300 p-2 rounded-lg hover:bg-gray-700">
					%%NAVBAR_HOME_TEXT%%
				</button>

				<button id="playButton"
					class="mx-2 cursor-pointer text-left bg-%%PLAY_COLOUR%% text-gray-300 p-2 rounded-lg hover:bg-gray-700">
					%%NAVBAR_PLAY_TEXT%%
				</button>

				<button id="tournamentButton"
					class="cursor-pointer text-left bg-%%TOURNAMENT_COLOUR%% text-gray-300 p-2 rounded-lg hover:bg-gray-700">
					%%NAVBAR_TOURNAMENT_TEXT%%
				</button>
			</div>

			<div class="ml-auto text-white">
				<select id="languageSelect">
					${languageSelect}
				</select>
			</div>
		</div>
	</div>
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
					class="cursor-pointer text-left bg-%%HOME_COLOUR%% text-gray-300 p-2 rounded-lg hover:bg-gray-700">
					%%NAVBAR_HOME_TEXT%%
				</button>

				<button id="playButton"
					class="mx-2 cursor-pointer text-left bg-%%PLAY_COLOUR%% text-gray-300 p-2 rounded-lg hover:bg-gray-700">
					%%NAVBAR_PLAY_TEXT%%
				</button>

				<button id="tournamentButton"
					class="cursor-pointer text-left bg-%%TOURNAMENT_COLOUR%% text-gray-300 p-2 rounded-lg hover:bg-gray-700">
					%%NAVBAR_TOURNAMENT_TEXT%%
				</button>
			</div>

			<div class="ml-auto text-white">
				<select id="languageSelect">
					${languageSelect}
				</select>
			</div>
		</div>
	</div>
	`;
}

function shimString(): string {
	return `
	<dialog id="dialogShim" class="max-h-full m-auto max-w-full w-screen h-screen bg-black opacity-70"></dialog>
	`;
}

function alertShimString(): string {
	return `
	<dialog id="alertShim" class="max-h-full m-auto max-w-full w-screen h-screen bg-black opacity-70"></dialog>
	`;
}

function alertString(): string {
	return `	
	<dialog id="alertDialog" class="mx-auto mt-20 rounded-lg shadow border w-120 bg-gray-900 border-gray-100 p-2">
		<div>
			<h1 class="text-xl font-bold text-white text-center">
				Transcendence
			</h1>
			<p id="alertContent" class="text-gray-400 text-center text-wrap"></p>
			<button id="closeAlertButton"
				class="float-right cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg px-2 py-1">OK</button>
		</div>
	</dialog>
	`;
}

function loginString(): string {
	return `
	<dialog id="loginDialog" class="m-auto content-center rounded-lg shadow border w-100 bg-gray-900 border-gray-100 text-center items-center">
		<div class="p-6 space-y-4">
			<h1 class="text-xl font-bold text-white">
				%%NAVBAR_LOGIN_TITLE_TEXT%%
			</h1>
			<form id="loginForm">
				<div>
					<input type="email" placeholder="%%NAVBAR_EMAIL_TEXT%%" name="email"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<div>
					<input type="password" name="password" placeholder="%%NAVBAR_PASSWORD_TEXT%%"
						class="mt-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<input type="submit" class="hidden" />

				<div class="grid grid-cols-2 justify-between">
					<button id="cancelLoginButton"
						class="mr-auto cursor-pointer text-red-500 my-4 hover:bg-gray-700 font-medium rounded-lg px-2 py-2"
						type="submit" formmethod="dialog" formnovalidate>%%NAVBAR_CANCEL_TEXT%%</button>
					<button id="loginButton" type="submit" formmethod="post"
						class="ml-auto cursor-pointer my-4 text-white hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-2 py-2">%%NAVBAR_LOGIN_TEXT%%</button>
				</div>
			</form>

			<div class="pt-2">
				<hr class="text-gray-100 w-8/10 mb-4 mx-auto"/>
				<img src="images/google.png" id="googleSigninButton" class="cursor-pointer mx-auto w-10 h-10" />
			</div>
		</div>
	</dialog>
	`;
}

function registerString(): string {
	return `	
	<dialog id="registerDialog" class="m-auto content-center rounded-lg shadow border w-100 bg-gray-900 border-gray-100 text-center items-center">
		<div class="p-6 space-y-4">
			<h1 class="text-xl font-bold text-white">
				%%NAVBAR_REGISTER_TITLE_TEXT%%
			</h1>
			<form id="registerForm">
				<div>
					<input type="text" name="nick" placeholder="%%NAVBAR_NICK_TEXT%%"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<div>
					<input type="email" name="email" placeholder="%%NAVBAR_EMAIL_TEXT%%"
						class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<div>
					<input type="password" name="password" minlength="8" placeholder="%%NAVBAR_PASSWORD_TEXT%%"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<input type="submit" class="hidden" />
				<div class="grid grid-cols-2 justify-between">
					<button id="cancelRegisterButton"
						class="mr-auto cursor-pointer text-red-500 my-4 hover:bg-gray-700 font-medium rounded-lg p-2"
						type="submit" formmethod="dialog" formnovalidate>%%NAVBAR_CANCEL_TEXT%%</button>
					<button id="signupButton" type="submit" formmethod="post"
						class="ml-auto cursor-pointer my-4 border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg p-2">%%NAVBAR_REGISTER_TEXT%%</button>
				</div>
			</form>
			<div class="pt-2">
				<hr class="text-gray-100 w-8/10 mb-4 mx-auto"/>
				<img src="images/google.png" id="googleSignupButton" class="cursor-pointer mx-auto w-10 h-10" />
			</div>
		</div>
	</dialog>
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
