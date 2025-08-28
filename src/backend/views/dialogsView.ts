export function alertString(): string {
	return `	
	<dialog id="alertDialog" class="backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 rounded-lg shadow border w-120 bg-gray-900 border-gray-100 p-2">
		<div>
			<h1 class="text-xl font-bold text-white text-center">
				Transcendence
			</h1>
			<p id="alertContent" class="text-gray-400 text-center text-wrap"></p>
			<button id="closeAlertButton"
				class="float-right cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg px-4 py-1">OK</button>
		</div>
	</dialog>
	`;
}

export function totpString(): string {
	return `
	<dialog id="totpCodeDialog" class="px-4 pt-2 backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 content-center rounded-lg shadow border w-120 bg-gray-900 border-gray-100 text-center items-center">
		<div>
			<h1 class="text-xl font-bold text-white">
				%%TEXT_TOTP_CODE_TITLE%%
			</h1>
			<form id="totpCodeForm">
				<div>
					<input type="text" placeholder="%%TEXT_TOTP_CODE%%" name="code" minlength="6" maxlength="6"
						class="my-2 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<input type="submit" class="hidden" />

				<div class="grid grid-cols-2 justify-between my-4">
					<button id="cancelTotpCodeButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-10 h-10 rounded-full my-auto">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<button type="submit" formmethod="post"
						class="ml-auto cursor-pointer text-white hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4 py-2">%%TEXT_TOTP_CODE_VERIFY%%</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}
