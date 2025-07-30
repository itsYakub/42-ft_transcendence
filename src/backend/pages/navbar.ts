import { translateBackend } from "./translations.js";

export function navbarHtml({ user, language }): string {
	const loggedIn = !user.error;
	let languageSelect = englishHtmlString;

	switch (language) {
		case "dutch":
			languageSelect = dutchHtmlString;
			break;
		case "polish":
			languageSelect = polishHtmlString;
			break;
	}

	if (loggedIn) {
		let html = loggedInHtmlString;
		html = html.replace("%%AVATAR%%", user.avatar);
		html = html.replace("%%NICK%%", user.nick);
		html = html.replace("%%LANGUAGESELECT%%", languageSelect);
		html = translate(html, language);
		return html;
	}
	else {
		let html = loggedOutHtmlString;		
		html = html.replace("%%LANGUAGESELECT%%", languageSelect);
		html += loginHtmlString + registerHtmlString
		html = translate(html, language);
		return html;
	}
}

function translate(html: string, language: string): string {
	const toBeTranslated = [ "HOME", "PLAY", "TOURNAMENT", "LOGIN", "OR", "REGISTER", "REGISTER_TITLE",
		"LOGIN_TITLE", "NICK", "EMAIL", "PASSWORD", "CANCEL" ];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%NAVBAR_${text}_TEXT%%`, translateBackend({
			language,
			text: `NAVBAR_${text}_TEXT`
		}));
	});

	return html;
}

const loggedOutHtmlString: string = `
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
					%%LANGUAGESELECT%%
				</select>
			</div>
		</div>
	</div>`;

const loggedInHtmlString: string = `
	<div class="h-full bg-gray-800">
		<div class="h-full w-200 mx-auto flex flex-row items-center">
			<div class="mr-auto">
				<img id="profileAvatar" class="rounded-full mx-auto border border-gray-800 cursor-pointer h-20 w-20"
					src="%%AVATAR%%" />
				<div id="profileNick" class="text-white text-center">%%NICK%%</div>
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
					%%LANGUAGESELECT%%
				</select>
			</div>
		</div>
	</div>`;

const loginHtmlString: string = `
	<dialog id="loginDialog" class="m-auto content-center rounded-lg shadow border bg-gray-800 border-gray-100">
		<div class="p-6 space-y-4">
			<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
				%%NAVBAR_LOGIN_TITLE_TEXT%%
			</h1>
			<form id="loginForm">
				<div>
					<input type="email" placeholder="%%NAVBAR_EMAIL_TEXT%%" name="email" value="abc@example.com"
						class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required="true">
				</div>
				<div>
					<input type="password" name="password" minlength="8" placeholder="%%NAVBAR_PASSWORD_TEXT%%" value="12345678"
						class="bg-gray-50 mt-2 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						required="true">
				</div>
				<input type="submit" class="hidden" />
				<button id="cancelLoginButton"
					class="cursor-pointer float-left text-red-500 my-4 hover:bg-gray-700 font-medium rounded-lg px-2 py-2 text-center"
					type="submit" formmethod="dialog" formnovalidate>%%NAVBAR_CANCEL_TEXT%%</button>
				<button id="loginButton" type="submit" formmethod="post"
					class="cursor-pointer float-right my-4 text-white hover:bg-gray-700 font-medium rounded-lg px-2 py-2 text-center">%%NAVBAR_LOGIN_TEXT%%</button>
			</form>

			<div class="pt-2">
				<hr class="text-gray-100 w-8/10 mb-4 mx-auto"/>
				<img src="images/google.png" id="googleSigninButton" class="cursor-pointer mx-auto w-10 h-10" />
			</div>
		</div>
	</dialog>`;

const registerHtmlString: string = `
	<dialog id="registerDialog" class="m-auto content-center rounded-lg shadow border bg-gray-800 border-gray-100">
		<div class="p-6 space-y-4">
			<h1 class="text-xl font-bold text-white">
				%%NAVBAR_REGISTER_TITLE_TEXT%%
			</h1>
			<form id="registerForm">
				<div>
					<input type="text" name="nick" placeholder="%%NAVBAR_NICK_TEXT%%" value="abc"
						class="border rounded-lg block w-full p-2.5 dark:bg-gray-700 border-gray-600 placeholder-gray-600 text-white"
						required="true">
				</div>
				<div>
					<input type="email" name="email" placeholder="%%NAVBAR_EMAIL_TEXT%%" value="abc@example.com"
						class="my-2 border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-600 text-white"
						required="true">
				</div>
				<div>
					<input type="password" name="password" minlength="8" placeholder="%%NAVBAR_PASSWORD_TEXT%%" value="12345678"
						class="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-600 text-white"
						required="true">
				</div>
				<input type="submit" class="hidden" />
				<div>
					<button id="cancelRegisterButton"
						class="cursor-pointer float-left text-red-500 my-4 hover:bg-gray-700 font-medium rounded-lg p-2 text-center"
						type="submit" formmethod="dialog" formnovalidate>%%NAVBAR_CANCEL_TEXT%%</button>
					<button id="signupButton" type="submit" formmethod="post"
						class="cursor-pointer float-right my-4 text-white hover:bg-gray-700 font-medium rounded-lg p-2 text-center">%%NAVBAR_REGISTER_TEXT%%</button>
				</div>
			</form>
			<div class="pt-2">
				<hr class="text-gray-100 w-8/10 mb-4 mx-auto"/>
				<img src="images/google.png" id="googleSignupButton" class="cursor-pointer mx-auto w-10 h-10" />
			</div>
		</div>
	</dialog>`;

const englishHtmlString: string = `
	<option class="bg-gray-800" value="english" selected>English</option>
	<option class="bg-gray-800" value="polish">Polski</option>
	<option class="bg-gray-800" value="dutch">Nederlands</option>
`;

const polishHtmlString: string = `
	<option class="bg-gray-800" value="english">English</option>
	<option class="bg-gray-800" value="polish" selected>Polski</option>
	<option class="bg-gray-800" value="dutch">Nederlands</option>
`;

const dutchHtmlString: string = `
	<option class="bg-gray-800" value="english">English</option>
	<option class="bg-gray-800" value="polish">Polski</option>
	<option class="bg-gray-800" value="dutch" selected>Nederlands</option>
`;
