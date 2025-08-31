export function loggedOutView(): string {
	return `
	<h1 class="text-gray-300 mt-8 text-center text-3xl">%%TEXT_USER_DECISION%%</h1>
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
			<h1 class="text-xl font-bold text-gray-300 mb-8">
				%%TEXT_LOG_IN_OR_REGISTER%%
			</h1>
			<form id="userForm">
				<div>
					<input type="email" name="email" placeholder="%%TEXT_EMAIL%%" autocomplete="email"
						class="my-4 border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300"
						required="true">
				</div>
				<div>
					<input type="password" name="password" minlength="8" placeholder="%%TEXT_PASSWORD%%" autocomplete="current-password"
						class="border rounded-lg block w-full p-2.5 bg-gray-800 border-gray-700 placeholder-gray-600 text-gray-300"
						required="true">
				</div>
				<div class="grid grid-cols-2 justify-between my-4">
					<button id="loginButton" type="submit" formmethod="post"
						class="mr-auto cursor-[url(/images/pointer.png),pointer] text-gray-300 hover:bg-gray-700 bg-gray-800 border border-gray-700 font-medium rounded-lg px-4 py-2">%%BUTTON_LOGIN%%</button>
					<button id="registerButton" type="submit" formmethod="post"
						class="ml-auto cursor-[url(/images/pointer.png),pointer] border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%BUTTON_REGISTER%%</button>
				</div>
				</form>
		</div>
	</div>
	`;
}

function googleString(): string {
	return `	
	<div class="rounded-lg shadow border py-8 bg-gray-900 border-gray-100 text-center">
		<button id="googleButton" class="w-60 cursor-[url(/images/pointer.png),pointer] border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%BUTTON_GOOGLE%% <img src="images/google.png" class="inline-block w-5 h-5" /></button>
	</div>
	`;
}

function guestString(): string {
	return `	
	<div class="rounded-lg shadow border py-8 bg-gray-900 border-gray-100 text-center">
		<button id="guestButton" class="w-60 cursor-[url(/images/pointer.png),pointer] border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 font-medium rounded-lg py-2 px-4">%%BUTTON_GUEST%%</button>
	</div>
	`;
}
