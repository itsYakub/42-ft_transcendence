import { User, UserChatPartner } from "../../common/interfaces.js";

export function userChatsView(partners: UserChatPartner[], user: User): string {
	return userChatsHtml(partners);
}

function partnersHtml(partners: UserChatPartner[]): string {
	let partnersString = "";
	partners.forEach(partner => {
		partnersString += partnerHtml(partner);
	});

	return partnersString;
}

function partnerHtml(partner: UserChatPartner): string {
	return `
		<div class="chatPartnerButton cursor-pointer text-right w-full text-gray-300 hover:bg-gray-800 p-2 rounded-lg" data-id="${partner.partnerId}">${partner.partnerNick}</div>
	`;
}

function userChatsHtml(partners: UserChatPartner[], messages = "", otherUserID = 1): string {
	return `
	<div class="w-full h-full bg-gray-900">
		<div class="h-full m-auto text-center flex flex-row">
			<div class="grow bg-gray-900">
				<div class="py-8 pl-8 text-left">
					<div class="border my-3 h-150 p-2 rounded-lg border-gray-700 overflow-auto">
						<div class="flex flex-row h-full">
							<div id="usersDiv" class="w-60 flex flex-col pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
								${partnersHtml(partners)}
							</div>
							<div class="bg-gray-700 w-0.5"></div>
							<div class="flex flex-col grow pl-2">
								<div id="messagesDiv" class="flex flex-col-reverse grow mt-2 gap-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
									${messages}
								</div>
								<div class="mt-2">
									<form id="sendUserChatForm">
										<div class="flex flex-row gap-1">
											<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
											<input type="submit" data-id="${otherUserID}" hidden>
											<button type="submit" class="border border-gray-700 py-1 px-2 cursor-pointer hover:bg-gray-700 rounded-lg bg-gray-800" data-id="${otherUserID}"><i class="text-gray-300 fa-solid fa-play"></i></button>
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

// function messageString(id: number, message: any) {
// 	return id == message.ToID ?
// 		`
// 	<div class="text-gray-300 bg-blue-700 mr-auto px-4 py-2 rounded-lg">${message.Message}</div>
// 	` :
// 		`
// 	<div class="text-gray-300 bg-green-700 ml-auto px-4 py-2 rounded-lg">${message.Message}</div>
// 	`;
// }
