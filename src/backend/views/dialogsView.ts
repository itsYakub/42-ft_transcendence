export function alertDialogHtml(): string {
	return `	
	<dialog id="alertDialog" class="backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 rounded-lg shadow border w-120 bg-gray-900 border-gray-100 p-2">
		<div>
			<h1 class="text-xl font-bold text-white text-center">
				Transcendence
			</h1>
			<p id="alertContent" class="text-gray-400 text-center text-wrap"></p>
			<button id="closeAlertButton"
				class="float-right cursor-[url(/images/pointer.png),pointer] border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg px-4 py-1">OK</button>
		</div>
	</dialog>
	`;
}

export function profileDialogHtml(): string {
	return `<dialog id="profileDialog" class="mx-auto mt-40 text-center content-center rounded-lg shadow border bg-gray-900 border-gray-100"></dialog>`;
}

export function appTotpDialogHtml(): string {
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
				<div class="flex flex-row justify-between items-center mt-4">
					<button id="cancelTOTPButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-8 h-8 rounded-full my-auto cursor-[url(/images/pointer.png),pointer]">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<input type="text" name="code" placeholder="%%TEXT_TOTP_CODE%%" minlength="6" maxlength="6"
						class="border text-center rounded-lg w-30 p-1.5 dark:bg-gray-700 border-gray-600 placeholder-gray-600 text-gray-300"
						required="true">
					<button id="verifyTOTPButton" type="submit"
						class="cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-700 border border-gray-700 bg-gray-800 font-medium rounded-lg py-1 px-2 text-center">%%BUTTON_TOTP_VERIFY%%</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}

export function totpLoginDialogHtml(): string {
	return `
	<dialog id="totpCodeDialog" class="px-4 pt-2 backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 content-center rounded-lg shadow border w-80 bg-gray-900 border-gray-100 text-center items-center">
		<div>
			<h1 class="text-xl font-bold text-white">
				%%TEXT_TOTP_CODE_TITLE%%
			</h1>
			<form id="totpCodeForm">
				<div>
					<input type="text" placeholder="%%TEXT_TOTP_CODE%%" name="code" minlength="6" maxlength="6"
						class="border w-40 h-7 text-center rounded-lg mx-auto my-2 p-1.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<input type="submit" class="hidden"/>
			</form>
		</div>
	</dialog>
	`;
}

/*
	This is the HTML that hosts the game. You can add ids and adjust anything at run time if needed
*/
export function gameDialogHtml(): string {
	return `
	<dialog id="gameDialog" class="w-8/10 h-8/10 m-auto text-center content-center rounded-lg shadow border bg-gray-900 border-gray-100"></dialog>
	`;
}
