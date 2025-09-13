import { partnersHtml } from "../../common/dynamicElements.js";
import { ChatMessage, ChatPartner, ShortUser, User } from "../../common/interfaces.js";
import { chatUsersHtml, profileDialogHtml } from "./dialogsView.js";

export function userChatsView(partners: ChatPartner[]): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg bg-stone-700 px-3 py-1">%%TEXT_CHAT_TITLE%%</div>
		<div class="flex flex-row h-120 w-full items-stretch gap-2">
			<fieldset class="w-80 border h-full flex flex-col gap-2 border-fuchsia-800 bg-red-200/20 rounded-lg p-3 pb-5">
				<legend class="text-fuchsia-800 text-center">%%TEXT_USERS%%</legend>
				<div id="notificationsButton" class="bg-red-300/50 cursor-[url(/images/pointer.png),pointer] text-right w-full text-stone-700 hover:bg-red-300 p-2 rounded-lg">%%BUTTON_NOTIFICATIONS%%</div>
				<div id="usersDiv" class="grow flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
					${partnersHtml(partners)}	
				</div>
				<div id="addUserChatButton" class="mx-auto mt-auto cursor-[url(/images/pointer.png),pointer]"><i class="text-fuchsia-800 hover:text-red-300 fa-solid fa-plus"></i></div>
			</fieldset>
			<fieldset class="grow border h-full flex flex-col justify-end border-fuchsia-800 bg-red-200/20 rounded-lg p-3">
				<legend class="text-fuchsia-800 text-center">%%TEXT_MESSAGES%%</legend>
				<div id="chatPartnerContainer" class="cursor-[url(/images/pointer.png),pointer]"></div>
				<div id="userChatsContainer" class="flex flex-col-reverse grow mt-2 gap-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto"></div>
				<form id="sendUserChatForm"></form>
			</fieldset>
		</div>
	</div>
	${chatUsersHtml()}
	${profileDialogHtml()}
	`;
}
