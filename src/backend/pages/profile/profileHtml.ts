import { translateBackend } from '../translations.js';

export function profileHtml({ user, language }): string {
	let html = profileString(user);
	html = translate(html, language);

	return html + totpString();
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["PROFILE", "MATCHES", "FRIENDS", "USER_PROFILE", "CHANGE_AVATAR", "CHANGE_NICK",
		"CHANGE_PASSWORD", "NEW_NICK", "CURRENT_PASSWORD", "NEW_PASSWORD", "REPEAT_PASSWORD", "UPDATE", "TOKENS",
		"ENABLE_TOTP", "DISABLE_TOTP", "LOGOUT", "INVALIDATE_TOKEN"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%PROFILE_${text}_TEXT%%`, translateBackend({
			language,
			text: `PROFILE_${text}_TEXT`
		}));
	});

	return html;
}

function profileString(user: any): string {
	return `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full w-200 m-auto text-center flex flex-row">
			<div class="w-50">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%PROFILE_PROFILE_TEXT%%</button>
					<button id="matchesButton"
						class="my-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%PROFILE_MATCHES_TEXT%%</button>
					<button id="friendsButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%PROFILE_FRIENDS_TEXT%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 m-auto text-left">
					<div class="text-white text-left text-xl mt-1">${user.nick}</div>					
					<div class="flex flex-row my-4">
						<div class="p-3 border border-gray-700 rounded-lg">
							<div class="text-white font-medium">%%PROFILE_CHANGE_AVATAR_TEXT%%</div>
							<div>
								<img class="mt-2 w-20 h-20 mx-auto cursor-pointer rounded-lg" src="${user.avatar}" id="avatarImage" />
								<input type="file" id="avatarFilename" accept=".png, .jpg, .jpeg" class="hidden">
							</div>
							<input type="hidden" id="userId" value="%%ID%%" />
						</div>
						<div class="grow ml-2 p-3 border border-gray-700 rounded-lg ">
							<span class="text-white font-medium">%%PROFILE_CHANGE_NICK_TEXT%%</span>
							<form id="changeNickForm">
								<div>
									<input type="text" id="newNick" placeholder="%%PROFILE_NEW_NICK_TEXT%%" required="true"
										class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
								</div>
								<div>
									<button type="submit" formmethod="post"
										class="ml-auto cursor-pointer block text-right mt-2 text-white hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_UPDATE_TEXT%%</button>
								</div>
							</form>
						</div>
					</div>
					${changePasswordString(user)}
					<div class="my-3 p-3 border border-gray-700 rounded-lg">
						<div class="text-white font-medium mb-2">%%PROFILE_TOKENS_TEXT%%</div>
						<div class="grid grid-cols-3">
							${1 == user.totpVerified ? disableTOTPString() : enableTOTPString()}
							<button id="logoutButton"
								class="cursor-pointer mx-3 bg-red-500 text-white hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_LOGOUT_TEXT%%</button>		
							<button id="invalidateTokenButton"
								class="cursor-pointer bg-red-500 text-white hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_INVALIDATE_TOKEN_TEXT%%</button>
			
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function totpString(): string {
	return `
	<dialog id="totpDialog" class="m-auto w-92 content-center rounded-lg shadow border bg-gray-800 border-gray-100">
		<div class="p-3">
			<h1 class="text-xl font-bold text-white mb-2">
				TOTP
			</h1>
			<div id="totpQRCode" class="bg-white h-86 w-86"></div>
			<div class="text-white text-wrap text-center my-2">Scan the QR code or enter this key into your authenticator app</div>
			<div id="totpSecret" class="text-white text-center"></div>
			<div class="text-white text-wrap text-center my-2">And input the code below</div>
			<form id="totpForm">
				<input type="submit" class="hidden" />
				<input type="text" name="code" placeholder="Code" minlength="6" maxlength="6"
					class="border rounded-lg block w-full p-2.5 dark:bg-gray-700 border-gray-600 placeholder-gray-600 text-white"
					required="true">
				<div>
					<button id="cancelTOTPButton"
						class="cursor-pointer float-left text-red-500 my-4 hover:bg-gray-700 font-medium rounded-lg p-2 text-center"
						type="submit" formmethod="dialog" formnovalidate>Cancel</button>
					<button id="verifyTOTPButton" type="submit" formmethod="post"
						class="cursor-pointer float-right my-4 text-white hover:bg-gray-700 font-medium rounded-lg p-2 text-center">Verify</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}

function changePasswordString(user: any): string {
	return user.google ? "" : `
	<div class="my-3 p-3 border border-gray-700 rounded-lg">
		<span class="text-white font-medium mb-4">%%PROFILE_CHANGE_PASSWORD_TEXT%%</span>
		<form id="changePasswordForm">
			<div>
				<input type="password" id="currentPassword" placeholder="%%PROFILE_CURRENT_PASSWORD_TEXT%%" required="true"
					class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
			</div>
			<div>
				<input type="password" id="newPassword" placeholder="%%PROFILE_NEW_PASSWORD_TEXT%%" minlength="8" required="true"
					class="my-2 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
			</div>
			<div>
				<input type="password" id="repeatPassword" placeholder="%%PROFILE_REPEAT_PASSWORD_TEXT%%" minlength="8" required="true"
					class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
			</div>
			<div>
				<button type="submit" formmethod="post"
					class="ml-auto cursor-pointer block text-right mt-2 text-white hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_UPDATE_TEXT%%</button>
			</div>
		</form>
	</div>
	`;
}

function enableTOTPString(): string {
	return `
	<button id="enableTOTPButton" class="cursor-pointer bg-green-500 text-white hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_ENABLE_TOTP_TEXT%%</button>
	`;
}

function disableTOTPString(): string {
	return `
	<button id="disableTOTPButton" class="cursor-pointer bg-red-500 text-white hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_DISABLE_TOTP_TEXT%%</button>
	`;
}
