import { User } from "../../common/interfaces.js";

export function accountView(user: User): string {
	let html = accountString(user);
	html += totpString();

	return html;
}

function accountString(user: User): string {
	return `
	<div class="w-8/10 m-auto h-full bg-gray-900">
		<div class="py-8 pl-8 m-auto text-left">
			<div class="text-gray-300 text-left text-xl mt-1">${user.nick}</div>					
			<div class="flex flex-row my-4">
				<div class="p-3 border border-gray-700 rounded-lg">
					<div class="text-gray-300 font-medium">%%TEXT_CHANGE_AVATAR%%</div>
					<div>
						<img class="mt-2 w-20 h-20 mx-auto cursor-pointer rounded-lg" src="${user.avatar}" id="avatarImage" />
						<input type="file" id="avatarFilename" accept=".png, .jpg, .jpeg" class="hidden">
					</div>
				</div>
				<div class="grow ml-2 p-3 border border-gray-700 rounded-lg ">
					<span class="text-gray-300 font-medium">%%TEXT_CHANGE_NICK%%</span>
					<form id="changeNickForm">
						<div>
							<input type="text" id="newNick" placeholder="%%TEXT_NEW_NICK%%" required="true"
								class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
						</div>
						<div>
							<button type="submit" formmethod="post"
								class="ml-auto cursor-pointer block text-right mt-2 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_UPDATE%%</button>
						</div>
					</form>
				</div>
			</div>
			${changePasswordString(user)}
			<div class="my-3 p-3 border border-gray-700 rounded-lg">
				<div class="text-gray-300 font-medium mb-2">%%TEXT_TOKENS%%</div>
				${securityString(user)}
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
				%%TEXT_TOTP_TITLE%%
			</h1>
			<div id="totpQRCode" class="bg-white h-86 w-86 mx-auto"></div>
			<div class="text-gray-300 text-wrap text-center my-2">%%TEXT_TOTP_SCAN%%</div>
			<div id="totpSecret" class="text-white text-center"></div>
			<div class="text-gray-300 text-wrap text-center my-2">%%TEXT_TOTP_INPUT%%</div>
			<form id="totpForm">
				<input type="submit" class="hidden" />
				<input type="text" name="code" placeholder="%%TEXT_TOTP_CODE%%" minlength="6" maxlength="6"
					class="border rounded-lg block w-full p-2.5 dark:bg-gray-700 border-gray-600 placeholder-gray-600 text-gray-300"
					required="true">
				<div class="grid grid-cols-2 justify-between mt-4">
					<button id="cancelTOTPButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-10 h-10 rounded-full my-auto">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<button id="verifyTOTPButton" type="submit" formmethod="post"
						class="ml-auto cursor-pointer text-gray-300 hover:bg-gray-700 border border-gray-700 bg-gray-800 font-medium rounded-lg py-2 px-4 text-center">%%BUTTON_TOTP_VERIFY%%</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}

function changePasswordString(user: any): string {
	return "google" == user.type ? "" : `
	<div class="my-3 p-3 border border-gray-700 rounded-lg">
		<span class="text-gray-300 font-medium mb-4">%%TEXT_CHANGE_PASSWORD%%</span>
		<form id="changePasswordForm">
			<div>
				<input type="password" id="currentPassword" placeholder="%%TEXT_CURRENT_PASSWORD%%" required="true"
					class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
			</div>
			<div>
				<input type="password" id="newPassword" placeholder="%%TEXT_NEW_PASSWORD%%" minlength="8" required="true"
					class="my-2 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
			</div>
			<div>
				<input type="password" id="repeatPassword" placeholder="%%TEXT_REPEAT_PASSWORD%%" minlength="8" required="true"
					class="my-1 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
			</div>
			<div>
				<button type="submit" formmethod="post"
					class="ml-auto cursor-pointer block text-right mt-2 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_UPDATE%%</button>
			</div>
		</form>
	</div>
	`;
}

function securityString(user: any): string {
	return "google" == user.type ?
		`
	<div class="grid grid-cols-2 gap-3">
		<button id="logoutButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_LOGOUT%%</button>		
		<button id="invalidateTokenButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_INVALIDATE_TOKEN%%</button>
	</div>
	`
		:
		`
	<div class="grid grid-cols-3 gap-3">
		${1 == user.totpVerified ? disableTOTPString() : enableTOTPString()}
		<button id="logoutButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_LOGOUT%%</button>		
		<button id="invalidateTokenButton"
			class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_INVALIDATE_TOKEN%%</button>
	</div>
	`;
}

function enableTOTPString(): string {
	return `
	<button id="enableTOTPButton" class="cursor-pointer bg-green-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_ENABLE_TOTP%%</button>
	`;
}

function disableTOTPString(): string {
	return `
	<button id="disableTOTPButton" class="cursor-pointer bg-red-500 text-gray-300 hover:bg-gray-800 font-medium rounded-lg p-2">%%BUTTON_DISABLE_TOTP%%</button>
	`;
}
