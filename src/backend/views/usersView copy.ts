// export function usersView({ otherUsers, friends, foeIds, messages, senders, otherUserId, user }): string {
// 	const userListHtml = userListString(otherUsers, foeIds, senders, otherUserId);
// 	const messageListHtml = privateMessageListString(user.id, messages, otherUserId);

// 	const friendsIDs: number[] = friends.map(friend => friend.friend_id);
// 	const isFriend: boolean = friendsIDs.includes(parseInt(otherUserId));
// 	const isInGame: boolean = user.gameId;

// 	return messagesString(user, isFriend, isInGame, userListHtml, messageListHtml, otherUserId);
// }

// /*
// 	The list of other user buttons
// */
// export function userListString(otherUsers: any, blockedIDs: any, senders: any, otherUserID: number) {
// 	let otherUserList = "";
// 	for (var key in otherUsers) {
// 		if (blockedIDs.includes(otherUsers[key].id))
// 			continue;
// 		otherUserList += otherUserString(otherUsers[key], senders, otherUserID);
// 	}

// 	return otherUserList;
// }

// /*
// 	The list of all messages from/to one user
// */
// export function privateMessageListString(id: number, messages: any, otherUserID: number) {
// 	let messageList = "";
// 	for (var key in messages) {
// 		messageList += messageString(id, messages[key]);
// 	}

// 	return messageList;
// }

// function messagesString(user: any, isFriend: boolean, isInGame: boolean, users: any, messages: any, otherUserID: number): string {
// 	return `
// 	<span id="data" data-id="${user.id}"></span>
// 	<div class="w-full h-full bg-gray-900">
// 		<div class="h-full m-auto text-center flex flex-row">
// 			<div class="w-30">
// 				<div class="flex flex-col items-end content-end mt-8 gap-4">
// 					<button id="accountButton"
// 						class="cursor-pointer text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_ACCOUNT%%</button>
// 					<button id="historyButton"
// 						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg hover:bg-gray-800">%%BUTTON_HISTORY%%</button>
// 					<button id="usersButton"
// 						class="cursor-pointer text-right w-full text-gray-300 p-2 rounded-lg bg-gray-800">%%BUTTON_USERS%%</button>
// 					<button id="friendsButton"
// 						class="text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_FRIENDS%%</button>
// 					<button id="foesButton"
// 						class="text-right w-full hover:bg-gray-800 text-gray-300 p-2 rounded-lg">%%BUTTON_FOES%%</button>
// 				</div>
// 			</div>
// 			<div class="grow bg-gray-900">
// 				<div class="py-8 pl-8 text-left">
// 					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 overflow-auto">
// 						<div class="flex flex-row h-full">
// 							<div id="usersDiv" class="w-60 flex flex-col pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
// 								${users}
// 							</div>
// 							<div class="bg-gray-700 w-0.5"></div>
// 							<div class="flex flex-col grow pl-2">
// 								${actionsDiv(otherUserID, isFriend, isInGame)}
// 								<div id="messagesDiv" class="flex flex-col-reverse grow mt-2 gap-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
// 									${messages}
// 								</div>
// 								<div class="mt-2">
// 									<form id="sendMessageForm">
// 										<div class="flex flex-row gap-1">
// 											<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
// 											<input type="submit" data-id="${otherUserID}" hidden>
// 											<button type="submit" class="border border-gray-700 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded-lg bg-gray-800" data-id="${otherUserID}"><i class="text-gray-300 fa-solid fa-play"></i></button>
// 										</div>
// 									</form>
// 								</div>						
// 							</div>
// 						</div>					
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	</div>
// 	`;
// }

// function actionsDiv(otherUserID: number, isFriend: boolean, isInGame: boolean) {
// 	if (0 == otherUserID)
// 		return "";

// 	const friendButtonsString = isFriend ? "" : `<button id="addFriendButton"><i class="text-green-300 cursor-pointer fa solid fa-plus"></i></button>
// 		<button id="addBlockedButton"><i class="text-red-300 cursor-pointer fa solid fa-ban"></i></button>`;

// 	const inviteButtonString = isInGame ? `<button id="inviteButton"><i class="text-white cursor-pointer fa solid fa-table-tennis-paddle-ball"></i></button>` : "";

// 	return `
// 	<div class="h-8 min-h-8 mt-1 grid grid-cols-4 justify-between ">
// 		<button id="viewProfileButton"><i class="text-white cursor-pointer fa solid fa-user"></i></button>	
// 		${inviteButtonString}
// 		${friendButtonsString}
// 	</div>
// 	`;
// }

// function otherUserString(otherUser: any, senders: any, otherUserID: number) {
// 	const textColour = senders.includes(otherUser.id) ? "text-yellow-200" : "text-gray-600";

// 	if (otherUser.id == otherUserID) {
// 		return `
// 		<button id="selectedUserButton" class="disabled text-right w-full p-2 rounded-lg ${textColour} bg-gray-800" data-id="${otherUser.id}">${otherUser.nick}</button>
// 		`;
// 	}
// 	else {
// 		return `
// 		<button class="messageUserButton cursor-pointer text-right w-full p-2 rounded-lg ${textColour} hover:bg-gray-800" data-id="${otherUser.id}">${otherUser.nick}</button>
// 		`;
// 	}
// }

// function messageString(id: number, message: any) {
// 	return id == message.ToID ?
// 		`
// 	<div class="text-gray-300 bg-blue-700 mr-auto px-4 py-2 rounded-lg">${message.Message}</div>
// 	` :
// 		`
// 	<div class="text-gray-300 bg-green-700 ml-auto px-4 py-2 rounded-lg">${message.Message}</div>
// 	`;
// }
