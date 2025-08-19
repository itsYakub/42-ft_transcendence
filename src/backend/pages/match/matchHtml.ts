import { gameHtmlString } from "../game/game.js";

export function matchHtml({ gamers, messages, user }): string {
	let html = matchString(gamers, messages, user);

	return html + gameHtmlString();
}

export function gamersString(gamers: any, user: any): string {
	let gamersString = "";
	gamers.forEach(gamer => {
		gamersString += gamerString(gamer);
	});

	const html = `
	<div class="flex flex-col gap-8">
		${gamersString}
	</div>
	<div class="flex flex-row justify-between mr-9">
		${readyButtonString(user)}
		<button id="leaveMatchButton" type="submit" class="text-gray-300 mt-4 bg-red-600 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_LEAVE%%</button>
	</div>
	`;

	return html;
}

export function messagesString(messages: any, user: any): string {
	let messageList = "";
	for (var key in messages) {
		messageList += messageString(user.id, messages[key]);
	}

	return messageList;
}

function matchString(gamers: any, messages: any, user: any): string {
	return `
	<div class="w-full h-full bg-gray-900 m-auto">
		<h1 class="text-white pt-4 mb-4 text-4xl text-center">%%TEXT_SINGLE_GAME%%</h1>
		<div class="flex flex-row h-150">
			<div class="flex flex-col">
				<form id="gamerMatchReadyForm">
					${gamersString(gamers, user)}
				</form>
			</div>
			<div class="grow border border-gray-700 rounded-lg p-2">				
				<div class="flex flex-col h-full">
					<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 overscroll-contain overflow-auto">
						${messagesString(messages, user)}
					</div>
					<div class="mt-2">
						<form id="sendMatchMessageForm">
							<div class="flex flex-row gap-1">
								<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
								<input type="submit" hidden>
								<button type="submit" class="border border-gray-700 py-0.5 px-2 cursor-pointer hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-gray-300 fa-solid fa-play"></i></button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function gamerString({ Nick, Ready }) {
	const readyText = 0 == Ready ? `<i class="fa-solid fa-xmark text-red-300 my-auto"></i>` : `<i class="fa-solid fa-check text-green-300 my-auto"></i>`;

	return `
	<div class="flex flex-row mr-2">
		<div class="w-60 py-2 mr-2 border border-gray-700 rounded-lg text-gray-400 text-center">${Nick}</div>
		${readyText}
	</div>
	`;
}

function readyButtonString({ ready }) {
	return 0 == ready ? `<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block cursor-pointer py-1 px-4 rounded-lg hover:bg-gray-700">%%BUTTON_READY%%</button>` :
		`<button type="submit" disabled class="text-gray-300 mt-4 bg-gray-800 block py-1 px-4 rounded-lg">%%BUTTON_READY%%</button>`;
}

function messageString(userID: number, message: any) {
	const diff = userID == message.FromID ? "green-700 ml" : "blue-700 mr";

	return `
	<div class="bg-${diff}-auto px-4 py-2 rounded-lg">
		<div class="text-white font-bold">${message.Nick}</div>
		<div class="text-gray-300">${message.Message}</div>
	</div>
	`;
}
