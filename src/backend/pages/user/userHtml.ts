import { translateBackend } from "../translations.js";

export function userHtml({ language }): string {
	let html = userString();
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["TITLE", "FORM_TITLE", "EMAIL", "PASSWORD", "LOGIN", "REGISTER", "GOOGLE_TITLE", "GUEST_TITLE"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%USER_${text}_TEXT%%`, translateBackend({
			language,
			text: `USER_${text}_TEXT`
		}));
	});

	return html;
}

function userString(): string {
	return `
	<h1 class="text-white mt-8 text-center text-3xl">%%USER_TITLE_TEXT%%</h1>
	<div class="grid grid-cols-2 gap-5 mt-12">
		${registerString()}
		<div class="flex flex-col justify-between">
			${googleString()}
			${guestString()}
		</div>
	</div>
	`;
}

function registerString(): string {
	return `	
	<div class="content-center rounded-lg shadow border px-4 pt-2 bg-gray-900 border-gray-100 text-center items-center">
		<div>
			<h1 class="text-xl font-bold text-white mb-8">
				%%USER_FORM_TITLE_TEXT%%
			</h1>
			<form id="userForm">
				<div>
					<input type="email" name="email" placeholder="%%USER_EMAIL_TEXT%%" autocomplete="email"
						class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<div>
					<input type="password" name="password" minlength="8" placeholder="%%USER_PASSWORD_TEXT%%" autocomplete="current-password"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<div class="grid grid-cols-2 justify-between my-4">
					<button id="loginButton" type="submit" formmethod="post"
						class="mr-auto cursor-pointer text-white hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4 py-2">%%USER_LOGIN_TEXT%%</button>
					<button id="registerButton" type="submit" formmethod="post"
						class="ml-auto cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%USER_REGISTER_TEXT%%</button>
				</div>
				</form>
		</div>
	</div>
	`;
}

function googleString(): string {
	return `	
	<div class="rounded-lg shadow border py-8 bg-gray-900 border-gray-100 text-center">
		<button id="googleButton" class="w-60 cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%USER_GOOGLE_TITLE_TEXT%% <img src="images/google.png" class="inline-block w-5 h-5" /></button>
	</div>
	`;
}

function guestString(): string {
	return `	
	<div class="rounded-lg shadow border py-8 bg-gray-900 border-gray-100 text-center">
		<button id="guestButton" class="w-60 cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%USER_GUEST_TITLE_TEXT%%</button>
	</div>
	`;
}
