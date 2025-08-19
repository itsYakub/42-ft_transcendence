import { translateBackend } from "../../translations.js";

export function messagesHtml({ otherUsers, messages, senders, otherUserID }, { user, language }): string {
	const userListHtml = userListString(otherUsers, senders, otherUserID);
	const messageListHtml = privateMessageListString(user.id, messages, otherUserID);

	let html = messagesString(user, userListHtml, messageListHtml, otherUserID);
	html = translate(html, language);

	return html;
}

/*
	The list of other user buttons
*/
export function userListString(otherUsers: any, senders: any, otherUserID: number) {
	let otherUserList = "";
	for (var key in otherUsers) {
		otherUserList += otherUserString(otherUsers[key], senders, otherUserID);
	}

	return otherUserList;
}

/*
	The list of all messages from/to one user
*/
export function privateMessageListString(id: number, messages: any, otherUserID: number) {
	let messageList = "";
	for (var key in messages) {
		messageList += messageString(id, messages[key]);
	}

	return messageList;
}

function translate(html: string, language: string): string {
	const toBeTranslated = ["PROFILE", "HISTORY", "FRIENDS", "MESSAGES", "SEND"];

	toBeTranslated.forEach((text) => {
		html = html.replaceAll(`%%MESSAGES_${text}_TEXT%%`, translateBackend({
			language,
			text: `MESSAGES_${text}_TEXT`
		}));
	});

	return html;
}

function messagesString(user: any, users: any, messages: any, otherUserID: number): string {
	return `
	<span id="data" data-id="${user.id}"></span>
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="w-30">
				<div class="flex flex-col items-end content-end mt-8">
					<button id="profileButton"
						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%MESSAGES_PROFILE_TEXT%%</button>
					<button id="historyButton"
						class="my-4 cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%MESSAGES_HISTORY_TEXT%%</button>
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
							<div id="usersDiv" class="w-60 flex flex-col pr-2 overscroll-contain overflow-auto">
								${users}
							</div>
							<div class="bg-gray-700 w-0.5"></div>
							<div class="flex flex-col grow pl-2">
								<div id="messagesDiv" class="flex flex-col-reverse grow gap-2 overscroll-contain overflow-auto">
									${messages}
								</div>
								<div class="mt-2">
									<form id="sendMessageForm">
										<div class="flex flex-row gap-1">
											<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
											<input type="submit" data-id="${otherUserID}" hidden>
											<button type="submit" class="border border-gray-700 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded-lg text-gray-300 bg-gray-800" data-id="${otherUserID}"><i class="fa fa-paper-plane"></i></button>
										</div>
									</form>
								</div>						
							</div>
						</div>					
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
}

function otherUserString(otherUser: any, senders: any, otherUserID: number) {
	const bgColour = otherUser.id == otherUserID ? "bg-gray-800" : "hover:bg-gray-800";
	const textColour = senders.includes(otherUser.id) ? "text-yellow-200" : "text-gray-600";

	if (otherUser.id == otherUserID) {
		return `
		<button id="selectedUserButton" class="disabled text-right w-full p-2 rounded-lg ${textColour} bg-gray-800" data-id="${otherUser.id}">${otherUser.nick}</button>
		`;
	}
	else {
		return `
		<button class="messageUserButton cursor-pointer text-right w-full p-2 rounded-lg ${textColour} hover:bg-gray-800" data-id="${otherUser.id}">${otherUser.nick}</button>
		`;
	}
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
