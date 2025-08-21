import { gameHtmlString } from "../game/game.js";

export function tournamentHtml({ gamers, messages, user }): string {
	const messageListHtml = messageListString(user.id, messages);

	let html = tournamentString(gamers, messageListHtml, user);

	return html + gameHtmlString();
}

function tournamentString(gamers: any, messages: any, user: any): string {
	let gamersString = "";
	gamers.forEach(gamer => {
		gamersString += gamerString(gamer);
	});

	return `
	<div class="w-full h-full bg-gray-900 m-auto">
		<h1 class="text-white pt-4 mb-4 text-4xl text-center">%%TEXT_TITLE%%</h1>
		<div class="flex flex-row h-150">
			<div class="flex flex-col mr-2">
				<form id="gamerTournamentReadyForm">
					<div class="flex flex-col gap-8">
						${gamersString}
					</div>
					<button type="submit" class="text-gray-300 mt-4 bg-gray-800 block mr-auto cursor-pointer py-2 px-4 rounded-lg hover:bg-gray-700">%%TEXT_READY%%</button>
				</form>
			</div>
			<div class="grow border border-gray-700 rounded-lg p-2">
				<div class="flex flex-col h-full">
					${messages}
					<div class="mt-2">
						<form id="sendTournamentMessageForm">
							<div class="flex flex-row gap-1">
								<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
								<input type="submit" data-id="${user.gameID}" data-user="${user.id}" hidden>
								<button type="submit" data-id="${user.gameID}" data-user="${user.id}" class="border border-gray-700 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded-lg text-gray-300 bg-gray-800">%%TEXT_SEND%%</button>
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
	<div class="flex flex-row">
		<div class="w-60 py-2 mr-2 border border-gray-700 rounded-lg text-gray-400 text-center">${Nick}</div>
		${readyText}
	</div>
	`;
}

function messageListString(userID: number, messages: any) {
	let messageList = "";
	for (var key in messages) {
		messageList += messageString(userID, messages[key]);
	}

	return `
	<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 overscroll-contain overflow-auto">
		${messageList}
	</div>`;
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
