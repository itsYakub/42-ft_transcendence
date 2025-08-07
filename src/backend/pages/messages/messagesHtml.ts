import { translateBackend } from "../translations.js";

export function messagesHtml({ users, messages, senders, fromID }, { user, language }): string {
	const userListHtml = userListString(users, senders, fromID);
	const messageListHtml = messageListString(user.id, messages, fromID);

	let html = messagesString(userListHtml, messageListHtml, fromID);
	html = translate(html, language);

	return html;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["PROFILE", "MATCHES", "FRIENDS", "MESSAGES", "SEND"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%MESSAGES_${text}_TEXT%%`, translateBackend({
			language,
			text: `MESSAGES_${text}_TEXT`
		}));
	});

	return html;
}

function messagesString(users: any, messages: any, fromID: number): string {
	return `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%MESSAGES_PROFILE_TEXT%%</button>
					<button id="matchesButton"
						class="my-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%MESSAGES_MATCHES_TEXT%%</button>
					<button id="friendsButton"
						class="text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%MESSAGES_FRIENDS_TEXT%%</button>
					<button id="messagesButton"
						class="mt-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg bg-gray-800">%%MESSAGES_MESSAGES_TEXT%%</button>
				</div>
			</div>
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 overflow-auto">
						<div class="flex flex-row h-full">
							<div class="w-60 flex flex-col pr-2 overscroll-contain overflow-auto">
								${users}
							</div>
							<div class="bg-gray-700 w-0.5"></div>
							<div class="flex flex-col grow pl-2">
							${messages}
							<div class="mt-2">
								<form id="sendMessageForm">
									<div class="flex flex-row gap-1">
										<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
										<input type="submit" data-id="${fromID}" hidden>
										<button type="submit" class="border border-gray-700 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded-lg text-gray-300 bg-gray-800" data-id="${fromID}">%%MESSAGES_SEND_TEXT%%</button>
									</div>
								</form>
							</div>						
						</div>
					</div>
					
				</div>
			</div>
		</div>
	</div>
	`;
}

function userListString(users: any, senders: any, fromID: number) {
	let userList = "";
	for (var key in users) {
		userList += userString(users[key], senders, fromID);
	}

	return userList;
}

function userString(user: any, senders: any, fromID: number) {
	const bgColour = user.id == fromID ? "bg-gray-800" : "hover:bg-gray-800";
	const textColour = senders.includes(user.id) ? "text-yellow-200" : "text-gray-600";

	return `
	<button class="messageUserButton cursor-pointer text-right w-full p-2 rounded-lg ${textColour} ${bgColour}" data-id="${user.id}">${user.nick}</button>
	`;
}

function messageListString(id: number, messages: any, fromID: number) {
	let messageList = "";
	for (var key in messages) {
		messageList += messageString(id, messages[key]);
	}

	return `
	<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 overscroll-contain overflow-auto">
		${messageList}
	</div>`;
}

function messageString(id: number, message: any) {
	return id == message.ToID ?
	`
	<div class="text-gray-300 bg-blue-700 mr-auto px-4 py-2 rounded-lg">${message.Message}</div>
	` :
	`
	<div class="text-gray-300 bg-green-700 ml-auto px-4 py-2 rounded-lg">${message.Message}</div>
	`;
}
