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
		<div class="chatPartnerButton cursor-[url(/images/pointer.png),pointer] text-right w-full text-gray-300 hover:bg-gray-800 p-2 rounded-lg" data-id="${partner.partnerId}">${partner.partnerNick}</div>
	`;
}

function userChatsHtml(partners: UserChatPartner[]): string {
	return `
	<span id="chatPartnerIdHolder"/>
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg border bg-gray-900 border-gray-900 px-3 py-1">%%TEXT_CHAT_TITLE%%</div>
		<div class="flex flex-row h-120 w-full items-stretch gap-2">
			<fieldset class="w-80 border h-full flex flex-col gap-2 border-fuchsia-800 bg-red-200/20 rounded-lg p-3 pb-5">
				<legend class="text-fuchsia-800">Users</legend>
				<div id="usersDiv" class="grow flex flex-col pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">
					${partnersHtml(partners)}
				</div>
				<div class="mx-auto mt-auto cursor-[url(/images/pointer.png),pointer]"><i class="text-fuchsia-800 hover:text-gray-900 fa-solid fa-plus"></i></div>
			</fieldset>
			<fieldset class="grow border h-full flex flex-col justify-end border-fuchsia-800 bg-red-200/20 rounded-lg p-3">
				<legend class="text-fuchsia-800">Messages</legend>
				<div id="userChatsContainer" class="flex flex-col-reverse grow mt-2 gap-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto"></div>
				<div class="mt-2">
					<form id="sendUserChatForm">
						<div class="flex flex-row gap-1">
							<input type="text" name="message" class="text-gray-300 grow border border-gray-700 rounded-lg px-2">
							<input type="submit" hidden>
							<button type="submit" class="border border-gray-700 py-1 px-2 cursor-[url(/images/pointer.png),pointer] hover:bg-gray-700 rounded-lg bg-gray-800"><i class="text-fuchsia-800 fa-solid fa-play"></i></button>
						</div>
					</form>
				</div>
			</fieldset>
		</div>
	</div>
	`;
}
