export function loggedOutView(): string {
	return `
	<h1 class="text-gray-300 mt-8 text-center text-3xl">%%TEXT_USER_DECISION%%</h1>
	<div class="flex flex-row gap-5 mt-12 justify-center">
		${loginOrRegisterHtml()}
		<div class="flex flex-col justify-between">
			${googleHtml()}
			${guestHtml()}
		</div>
	</div>
	`;
}

function loginOrRegisterHtml(): string {
	return `	
	<fieldset class="rounded-lg border border-gray-700 p-3 w-100">
		<legend class="text-gray-300">%%TEXT_LOG_IN_OR_REGISTER%%</legend>			
		<form id="userForm" class="flex flex-col gap-2">
			<div>
				<input type="email" name="email" placeholder="%%TEXT_EMAIL%%" autocomplete="email"
					class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300"
					required="true">
			</div>
			<div>
				<input type="password" name="password" minlength="8" placeholder="%%TEXT_PASSWORD%%" autocomplete="current-password"
					class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300"
					required="true">
			</div>
			<div class="flex flex-row justify-end gap-2">
				<button id="loginButton" type="submit"
					class="cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-800 font-medium rounded-lg px-2 py-1">%%BUTTON_LOGIN%%</button>
				<button id="registerButton" type="submit"
					class="cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-800 font-medium rounded-lg px-2 py-1">%%BUTTON_REGISTER%%</button>
			</div>
			</form>
	</fieldset>
	`;
}

function googleHtml(): string {
	return `	
	<fieldset class="rounded-lg border border-gray-700 p-3">
		<legend class="text-gray-300">Google</legend>
		<button id="googleButton" class="w-60 cursor-[url(/images/pointer.png),pointer] border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%BUTTON_GOOGLE%% <img src="images/google.png" class="inline-block w-5 h-5" /></button>
	</fieldset>
	`;
}

function guestHtml(): string {
	return `	
	<fieldset class="rounded-lg border border-gray-700 p-3">
		<legend class="text-gray-300">%%TEXT_GUEST%%</legend>
		<button id="guestButton" class="w-60 cursor-[url(/images/pointer.png),pointer] border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%BUTTON_GUEST%%</button>
	</div>
	`;
}
