import { TotpType, User, UserType } from "../../common/interfaces.js";
import { enableTotpHtml } from "./dialogsView.js";

export function accountView(user: User): string {
	return `
	<div class="w-8/10 m-auto h-full bg-gray-900">
		<div class="py-8 pl-8 m-auto text-left">
			<div class="text-gray-300 text-left text-xl mt-1">${user.nick}</div>					
			<div class="flex flex-row my-4 gap-2">
				<fieldset class="p-3 border border-gray-700 rounded-lg">
					<legend class="text-gray-300">%%TEXT_CHANGE_AVATAR%%</legend>
					<div>
						<img class="w-20 h-20 mx-auto cursor-[url(/images/pointer.png),pointer] rounded-lg" src="${user.avatar}" id="avatarImage" />
						<input type="file" id="avatarFilename" accept=".png, .jpg, .jpeg" class="hidden">
					</div>
				</fieldset>
				<fieldset class="grow p-3 border border-gray-700 rounded-lg">
					<legend class="text-gray-300">%%TEXT_CHANGE_NICK%%</legend>
					<form id="changeNickForm">
						<div>
							<input type="text" maxlength="25" id="newNick" placeholder="%%TEXT_NEW_NICK%%" required="true"
								class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
						</div>
						<div>
							<button type="submit" formmethod="post"
								class="ml-auto cursor-[url(/images/pointer.png),pointer] block text-right mt-2 text-gray-300 hover:bg-gray-800 font-medium rounded-lg px-2 py-1">%%BUTTON_UPDATE%%</button>
						</div>
					</form>
				</fieldset>
			</div>
			${securityHtml(user)}		
			<div class="flex flex-row justify-end gap-2">
				<button id="logoutButton" class="cursor-[url(/images/pointer.png),pointer] text-red-300 hover:bg-gray-800 font-medium rounded-lg px-2 py-1">%%BUTTON_LOGOUT%%</button>
				<button id="invalidateTokenButton" class="cursor-[url(/images/pointer.png),pointer] text-red-300 hover:bg-gray-800 font-medium rounded-lg px-2 py-1">%%BUTTON_INVALIDATE_TOKEN%%</button>
			</div>
		</div>
	</div>
	${enableTotpHtml()}
	`;
}

function securityHtml(user: User): string {
	return UserType.GOOGLE != user.userType ? "" :
	`
	<div class="flex flex-row my-4 gap-2">
		<fieldset class="border border-gray-700 rounded-lg p-3 grow">
			<legend class="text-gray-300">%%TEXT_CHANGE_PASSWORD%%</legend>
			<form id="changePasswordForm" class="flex flex-col gap-2">
				<div>
					<input type="password" id="currentPassword" maxlength="32" placeholder="%%TEXT_CURRENT_PASSWORD%%" required="true"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				</div>
				<div>
					<input type="password" id="newPassword" maxlength="32" placeholder="%%TEXT_NEW_PASSWORD%%" minlength="8" required="true"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				</div>
				<div>
					<input type="password" id="repeatPassword" maxlength="32" placeholder="%%TEXT_REPEAT_PASSWORD%%" minlength="8" required="true"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				</div>
				<div>
					<button type="submit" formmethod="post"
						class="ml-auto cursor-[url(/images/pointer.png),pointer] block text-right text-gray-300 hover:bg-gray-800 font-medium rounded-lg px-2 py-1">%%BUTTON_UPDATE%%</button>
				</div>
			</form>
		</fieldset>
		<fieldset class="border border-gray-700 rounded-lg flex flex-col p-3 gap-6 pt-5">
			<legend class="text-gray-300">%%TEXT_TOTP_TITLE%%</legend>
			<div class="text-gray-300 text-lg cursor-[url(/images/pointer.png),pointer]">
				<input type="radio" class="totpSetting" id="disableTotpButton" name="totpSetting" value="${TotpType.DISABLED}" ${TotpType.DISABLED == user.totpType ? "checked" : ""}/>
				<label for="disableTotpButton">%%BUTTON_DISABLE_TOTP%%</label>
			</div>
			<div class="text-gray-300 text-lg cursor-[url(/images/pointer.png),pointer]">
				<input type="radio" class="totpSetting" id="enableAppTotpButton" name="totpSetting" value="${TotpType.APP}" ${TotpType.APP == user.totpType ? "checked" : ""}/>
				<label for="enableAppTotpButton">%%BUTTON_APP_TOTP%%</label>
			</div>
			<div class="text-gray-300 text-lg cursor-[url(/images/pointer.png),pointer]">
				<input type="radio" class="totpSetting" id="enableEmailTotpButton" name="totpSetting" value="${TotpType.EMAIL}" ${TotpType.EMAIL == user.totpType ? "checked" : ""}/>
				<label for="enableEmailTotpButton">%%BUTTON_EMAIL_TOTP%%</label>
			</div>
		</fieldset>
	</div>
	`;
}
