import { Foe, User } from "../../common/interfaces.js";

export function foesView(foes: Foe[]): string {
	if (0 == foes.length) {
		return `
		<div class="flex flex-col items-center gap-4">
			<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg border bg-gray-900 border-gray-900 px-3 py-1">%%TEXT_USERS_TITLE%%</div>
			${switcherHtml()}
			<div class="text-gray-300 pt-8 text-center">%%TEXT_NO_FOES%%</div>
		</div>
		`;
	}

	return foesViewHtml(foes);
}

export function foesHtml(foes: Foe[]) {
	let userList = "";
	for (var key in foes) {
		userList += foeHtml(foes[key]);
	}

	return userList;
}

function foesViewHtml(foes: Foe[]): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 text-center text-3xl rounded-lg border bg-gray-900 border-gray-900 px-3 py-1">%%TEXT_USERS_TITLE%%</div>
		${switcherHtml()}
		<div class="h-100 p-2 w-full text-center mx-auto flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-auto">	
			${foesHtml(foes)}
		</div>					
	</div>
	`;
}

function switcherHtml(): string {
	return `
		<div class="flex flex-row justify-center items-center mb-2 gap-2">
			<div id="allButton" class="cursor-[url(/images/pointer.png),pointer] px-3 py-1 rounded-lg text-gray-900 hover:bg-fuchsia-800">All</div>
			<div id="friendsButton" class="cursor-[url(/images/pointer.png),pointer] px-3 py-1 rounded-lg text-gray-900 hover:bg-fuchsia-800">Friends</div>
			<div class="disabled p-2 rounded-lg text-gray-300 bg-fuchsia-800 px-3 py-1">Foes</div>
		</div>
	`;
}

function foeHtml(foe: Foe): string {
	return `
	<div class="foeButton border w-7/10 p-2.5 rounded-lg border-gray-700 mx-auto bg-gray-800 text-gray-300">
		<div class="flex flex-row gap-4">
			<div class="grow">${foe.nick}</div>
			<div class="text-right my-auto">
				<div class="relative group">
					<button class="removeFoeButton cursor-[url(/images/pointer.png),pointer]" data-id="${foe.foeId}"></data><i class="text-red-300 fa-solid fa-minus"></i></button>
					<div class="absolute right-full top-1/2 transform hover:opacity-0 -translate-y-1/2 mr-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100">%%TEXT_REMOVE_FOE%%</div>
				</div>
			</div>
		</div>
	</div>
	`;
}
