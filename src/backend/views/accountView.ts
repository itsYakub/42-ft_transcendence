import { TotpType, User, UserType } from "../../common/interfaces.js";
import { appTotpDialogHtml, totpLoginDialogHtml } from "./dialogsView.js";

export function accountView(user: User): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg border bg-gray-900 border-gray-900 px-3 py-1">%%TEXT_ACCOUNT_TITLE%%</div>		
		<div class="flex flex-row w-full gap-2">
			<fieldset class="p-3 border border-fuchsia-800 bg-red-200/20 rounded-lg">
				<legend class="text-fuchsia-800">%%TEXT_CHANGE_AVATAR%%</legend>
				<div>
					<img class="w-20 h-20 mx-auto cursor-[url(/images/pointer.png),pointer] rounded-lg" src="${user.avatar}" id="avatarImage" />
					<input type="file" id="avatarFilename" accept=".png, .jpg, .jpeg" class="hidden">
				</div>
			</fieldset>
			<fieldset class="grow p-3 border border-fuchsia-800 bg-red-200/20 rounded-lg">
				<legend class="text-fuchsia-800">%%TEXT_CHANGE_NICK%%</legend>
				<form id="changeNickForm" class="flex flex-col">
					<input type="text" maxlength="25" id="newNick" placeholder="%%TEXT_NEW_NICK%%" required="true"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white">
					<button type="submit" formmethod="post"
						class="ml-auto cursor-[url(/images/pointer.png),pointer] mt-2 hover:text-gray-900 text-fuchsia-800">%%BUTTON_UPDATE%%</button>
				</form>
			</fieldset>
		</div>
		${securityHtml(user)}		
		<div class="flex flex-row w-full justify-end gap-4">
			<button id="logoutButton" class="cursor-[url(/images/pointer.png),pointer] text-red-900 font-bold hover:text-fuchsia-800">%%BUTTON_LOGOUT%%</button>
			<button id="invalidateTokenButton" class="cursor-[url(/images/pointer.png),pointer] text-red-900 font-bold hover:text-fuchsia-800">%%BUTTON_INVALIDATE_TOKEN%%</button>
		</div>
	</div>
	${appTotpDialogHtml()}
	${totpLoginDialogHtml()}
	`;
}

function securityHtml(user: User): string {
	//return UserType.GOOGLE == user.userType ? "" :
	return `
	<div class="flex flex-row w-full my-4 gap-2">
		<fieldset class="border border-fuchsia-800 bg-red-200/20 rounded-lg p-3 grow">
			<legend class="text-fuchsia-800">%%TEXT_CHANGE_PASSWORD%%</legend>
			<form id="changePasswordForm" class="flex flex-col gap-2">
				<input type="password" id="currentPassword" maxlength="32" placeholder="%%TEXT_CURRENT_PASSWORD%%" required="true"
					class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="password" id="newPassword" maxlength="32" placeholder="%%TEXT_NEW_PASSWORD%%" minlength="8" required="true"
					class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<input type="password" id="repeatPassword" maxlength="32" placeholder="%%TEXT_REPEAT_PASSWORD%%" minlength="8" required="true"
					class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300">
				<button type="submit" formmethod="post"
					class="ml-auto cursor-[url(/images/pointer.png),pointer] hover:text-gray-900 text-fuchsia-800">%%BUTTON_UPDATE%%</button>
			</form>
		</fieldset>
		<fieldset class="border border-fuchsia-800 rounded-lg bg-red-200/20 flex flex-col p-3 gap-6 pt-5">
			<legend class="text-fuchsia-800">%%TEXT_TOTP_TITLE%%</legend>
			<div class="text-gray-900 text-lg cursor-[url(/images/pointer.png),pointer]">
				<input type="radio" cursor-[url(/images/pointer.png),pointer] class="totpSetting" id="disableTotpButton" name="totpSetting" value="${TotpType.DISABLED}" ${TotpType.DISABLED == user.totpType ? "checked" : ""}/>
				<label for="disableTotpButton" class="cursor-[url(/images/pointer.png),pointer]">%%BUTTON_DISABLE_TOTP%%</label>
			</div>
			<div class="text-gray-900 text-lg cursor-[url(/images/pointer.png),pointer]">
				<input type="radio" class="totpSetting" cursor-[url(/images/pointer.png),pointer] id="enableAppTotpButton" name="totpSetting" value="${TotpType.APP}" ${TotpType.APP == user.totpType ? "checked" : ""}/>
				<label for="enableAppTotpButton" class="cursor-[url(/images/pointer.png),pointer]">%%BUTTON_APP_TOTP%%</label>
			</div>
			<div class="text-gray-900 text-lg cursor-[url(/images/pointer.png),pointer]">
				<input type="radio" class="totpSetting" cursor-[url(/images/pointer.png),pointer] id="enableEmailTotpButton" name="totpSetting" value="${TotpType.EMAIL}" ${TotpType.EMAIL == user.totpType ? "checked" : ""}/>
				<label for="enableEmailTotpButton" class="cursor-[url(/images/pointer.png),pointer]">%%BUTTON_EMAIL_TOTP%%</label>
			</div>
		</fieldset>
	</div>
	`;
}
