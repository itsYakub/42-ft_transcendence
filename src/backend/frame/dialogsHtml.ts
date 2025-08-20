export function alertString(): string {
	return `	
	<dialog id="alertDialog" class="backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 rounded-lg shadow border w-120 bg-gray-900 border-gray-100 p-2">
		<div>
			<h1 class="text-xl font-bold text-white text-center">
				Transcendence
			</h1>
			<p id="alertContent" class="text-gray-400 text-center text-wrap"></p>
			<button id="closeAlertButton"
				class="float-right cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg px-4 py-2">OK</button>
		</div>
	</dialog>
	`;
}

export function loginString(): string {
	return `
	<dialog id="loginDialog" class="backdrop:bg-black backdrop:opacity-70 m-auto content-center rounded-lg shadow border w-100 bg-gray-900 border-gray-100 text-center items-center">
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

				<div class="grid grid-cols-2 justify-between my-4">
					<button id="cancelLoginButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-10 h-10 rounded-full my-auto">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<button id="loginButton" type="submit" formmethod="post"
						class="ml-auto cursor-pointer text-white hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4 py-2">%%NAVBAR_LOGIN_TEXT%%</button>
				</div>
			</form>

			<div class="pt-2">
				<hr class="text-gray-400 w-8/10 mb-4 mx-auto"/>
				<img src="images/google.png" id="googleSigninButton" class="cursor-pointer mx-auto w-10 h-10" />
			</div>
		</div>
	</dialog>
	`;
}

export function registerString(): string {
	return `	
	<dialog id="registerDialog" class="backdrop:bg-black backdrop:opacity-70 m-auto content-center rounded-lg shadow border w-100 bg-gray-900 border-gray-100 text-center items-center">
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
				<div class="grid grid-cols-2 justify-between my-4">
					<button id="cancelRegisterButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-10 h-10 rounded-full my-auto">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<button id="signupButton" type="submit" formmethod="post"
						class="ml-auto cursor-pointer border border-gray-700 bg-gray-800 text-white hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%NAVBAR_REGISTER_TEXT%%</button>
				</div>
			</form>
			<div class="pt-2">
				<hr class="text-gray-400 w-8/10 mb-4 mx-auto"/>
				<img src="images/google.png" id="googleSignupButton" class="cursor-pointer mx-auto w-10 h-10" />
			</div>
		</div>
	</dialog>
	`;
}

export function totpString(): string {
	return `
	<dialog id="totpCodeDialog" class="px-4 pt-2 backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 content-center rounded-lg shadow border w-120 bg-gray-900 border-gray-100 text-center items-center">
		<div>
			<h1 class="text-xl font-bold text-white">
				%%NAVBAR_TOTP_CODE_TITLE_TEXT%%
			</h1>
			<form id="totpCodeForm">
				<div>
					<input type="text" placeholder="%%NAVBAR_TOTP_CODE_TEXT%%" name="code" minlength="6" maxlength="6"
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
						class="ml-auto cursor-pointer text-white hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4 py-2">%%NAVBAR_TOTP_CODE_VERIFY_TEXT%%</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}

export function gamerNameString(): string {
	return `
	<dialog id="gamerNameDialog" class="px-4 pt-2 backdrop:bg-black backdrop:opacity-70 mx-auto mt-20 content-center rounded-lg shadow border w-120 bg-gray-900 border-gray-100 text-center items-center">
		<div>
			<h1 class="text-xl font-bold text-white">
				%%NAVBAR_PLAYER_NAME_TITLE_TEXT%%
			</h1>
			<form id="gamerNameForm">
				<div>
					<input type="text" placeholder="%%NAVBAR_PLAYER_NAME_TEXT%%" name="name" maxlength="20"
						class="my-2 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-white"
						required="true">
				</div>
				<input type="submit" class="hidden" />

				<div class="grid grid-cols-2 justify-between my-4">
					<button id="cancelPlayerNameButton" type="submit" formmethod="dialog" formnovalidate
						class="hover:bg-gray-700 text-gray-400 w-10 h-10 rounded-full my-auto">
						<i class="fa-solid fa-arrow-left "></i>
					</button>
					<button type="submit" formmethod="post"
						class="ml-auto cursor-pointer text-white hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4 py-2">%%NAVBAR_PLAYER_NAME_SET_TEXT%%</button>
				</div>
			</form>
		</div>
	</dialog>
	`;
}
