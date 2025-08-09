import { translateBackend } from '../translations.js';

export function profileHtml({ user, language }): string {
	let html = profileString(user);
	html += totpString();
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["PROFILE", "HISTORY", "FRIENDS", "MESSAGES", "USER_PROFILE", "CHANGE_AVATAR", "CHANGE_NICK",
		"CHANGE_PASSWORD", "NEW_NICK", "CURRENT_PASSWORD", "NEW_PASSWORD", "REPEAT_PASSWORD", "UPDATE", "TOKENS",
		"ENABLE_TOTP", "DISABLE_TOTP", "LOGOUT", "INVALIDATE_TOKEN", "TOTP_TITLE", "TOTP_SCAN", "TOTP_INPUT", 
		"TOTP_CODE", "TOTP_VERIFY", ];

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
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="text-right w-full bg-gray-800 text-gray-300 p-2 rounded-lg">%%PROFILE_PROFILE_TEXT%%</button>
					<button id="historyButton"
						class="my-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%PROFILE_HISTORY_TEXT%%</button>
					<button id="friendsButton"
						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%PROFILE_FRIENDS_TEXT%%</button>
					<button id="messagesButton"
						class="mt-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%PROFILE_MESSAGES_TEXT%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 m-auto text-left">
					<div class="text-gray-300 text-left text-xl mt-1">${user.nick}</div>					
					<div class="flex flex-row my-4">
						<div class="p-3 border border-gray-700 rounded-lg">
							<div class="text-gray-300 font-medium">%%PROFILE_CHANGE_AVATAR_TEXT%%</div>
							<div>
								<img class="mt-2 w-20 h-20 mx-auto cursor-pointer rounded-lg" src="${user.avatar}" id="avatarImage" />
								<input type="file" id="avatarFilename" accept=".png, .jpg, .jpeg" class="hidden">
							</div>
							<input type="hidden" id="userId" value="%%ID%%" />
						</div>
						<div class="grow ml-2 p-3 border border-gray-700 rounded-lg ">
							<span class="text-gray-300 font-medium">%%PROFILE_CHANGE_NICK_TEXT%%</span>
							<form id="changeNickForm">
								<div>
									<input type="text" id="newNick" placeholder="%%PROFILE_NEW_NICK_TEXT%%" required="true"
										class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
								</div>
								<div>
									<button type="submit" formmethod="post"
										class="ml-auto cursor-pointer block text-right mt-2 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_UPDATE_TEXT%%</button>
								</div>
							</form>
						</div>
					</div>
					${changePasswordString(user)}
					<div class="my-3 p-3 border border-gray-700 rounded-lg">
						<div class="text-gray-300 font-medium mb-2">%%PROFILE_TOKENS_TEXT%%</div>
						${securityString(user)}
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function totpString(): string {
	return `
	<dialog id="totpDialog" class="backdrop:bg-black backdrop:opacity-70 m-auto w-100 content-center rounded-lg shadow border bg-gray-900 border-gray-100">
		<div class="p-3">
			<h1 class="text-xl font-bold text-white mb-2 text-center">
				%%PROFILE_TOTP_TITLE_TEXT%%
			</h1>
			<div id="totpQRCode" class="bg-white h-86 w-86 mx-auto"></div>
			<div class="text-gray-300 text-wrap text-center my-2">%%PROFILE_TOTP_SCAN_TEXT%%</div>
			<div id="totpSecret" class="text-white text-center"></div>
			<div class="text-gray-300 text-wrap text-center my-2">%%PROFILE_TOTP_INPUT_TEXT%%</div>
			<form id="totpForm">
				<input type="submit" class="hidden" />
				<input type="text" name="code" placeholder="%%PROFILE_TOTP_CODE_TEXT%%" minlength="6" maxlength="6"
					class="border rounded-lg block w-full p-2.5 dark:bg-gray-700 border-gray-600 placeholder-gray-600 text-gray-300"
					required="true">
				<div class="grid grid-cols-2 justify-between mt-4">
					<button id="cancelTOTPButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-10 h-10 rounded-full my-auto">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<button id="verifyTOTPButton" type="submit" formmethod="post"
						class="ml-auto cursor-pointer text-gray-300 hover:bg-gray-700 border border-gray-700 bg-gray-800 font-medium rounded-lg py-2 px-4 text-center">%%PROFILE_TOTP_VERIFY_TEXT%%</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}

function changePasswordString(user: any): string {
	return user.google ? "" : `
	<div class="my-3 p-3 border border-gray-700 rounded-lg">
		<span class="text-gray-300 font-medium mb-4">%%PROFILE_CHANGE_PASSWORD_TEXT%%</span>
		<form id="changePasswordForm">
			<div>
				<input type="password" id="currentPassword" placeholder="%%PROFILE_CURRENT_PASSWORD_TEXT%%" required="true"
					class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
			</div>
			<div>
				<input type="password" id="newPassword" placeholder="%%PROFILE_NEW_PASSWORD_TEXT%%" minlength="8" required="true"
					class="my-2 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
			</div>
			<div>
				<input type="password" id="repeatPassword" placeholder="%%PROFILE_REPEAT_PASSWORD_TEXT%%" minlength="8" required="true"
					class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
			</div>
			<div>
				<button type="submit" formmethod="post"
					class="ml-auto cursor-pointer block text-right mt-2 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_UPDATE_TEXT%%</button>
			</div>
		</form>
	</div>
	`;
}

function securityString(user: any): string {
	return user.google ?
	`
	<div class="grid grid-cols-2 gap-3">
		<button id="logoutButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_LOGOUT_TEXT%%</button>		
		<button id="invalidateTokenButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_INVALIDATE_TOKEN_TEXT%%</button>
	</div>
	`
	:
	`
	<div class="grid grid-cols-3 gap-3">
		${1 == user.totpVerified ? disableTOTPString() : enableTOTPString()}
		<button id="logoutButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_LOGOUT_TEXT%%</button>		
		<button id="invalidateTokenButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_INVALIDATE_TOKEN_TEXT%%</button>
	</div>
	`;
}

function enableTOTPString(): string {
	return `
	<button id="enableTOTPButton" class="cursor-pointer bg-green-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_ENABLE_TOTP_TEXT%%</button>
	`;
}

function disableTOTPString(): string {
	return `
	<button id="disableTOTPButton" class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%PROFILE_DISABLE_TOTP_TEXT%%</button>
	`;
}
