export function homeView(): string {
	return `
	<div class="flex flex-col items-center gap-4">
		<div class="text-gray-300 mt-8 mb-4 text-center text-3xl rounded-lg border bg-gray-900 border-gray-900 px-3 py-1">%%TEXT_WELCOME%%</div>
		<div>
			<img class="w-80 h-80 opacity-80 outline-fuchsia-800 outline-2 outline-offset-2 rounded-lg" src="/images/team.jpg"/>
			<div class="text-gray-300 mt-1 text-center">%%TEXT_TEAM%%</div>
		</div>
		<div class="text-gray-300 text-center text-3xl rounded-lg border bg-gray-900 border-gray-900 px-3 py-1">%%TEXT_TECH%%</div>
		<div class="flex flex-row gap-2 h-10">
			<img src="/images/babylonjs.png" class="h-10 w-10"/>
			<img src="/images/docker.svg" class="h-10 w-10"/>
			<img src="/images/git.svg" class="h-10 w-10"/>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="url(#a)" d="M49.915 74.438C72.04 104.596 93.69 66.019 93.658 42.82 93.621 15.392 65.82.063 49.898.063 24.338.063 0 21.184 0 50.084 0 82.207 27.9 100 49.897 100c-4.977-.717-21.566-4.271-21.789-42.48-.15-25.84 8.43-36.165 21.753-31.624.299.111 14.696 5.79 14.696 24.344 0 18.475-14.642 24.197-14.642 24.197"/><path fill="url(#b)" d="M49.89 25.875c-14.62-5.038-32.528 7.01-32.528 31.143 0 39.405 29.201 42.982 32.74 42.982C75.662 100 100 78.877 100 49.978 100 17.855 72.1.062 50.103.062 56.195-.782 82.94 6.656 82.94 43.21c0 23.838-19.97 36.815-32.96 31.27-.298-.11-14.696-5.79-14.696-24.343 0-18.475 14.605-24.262 14.605-24.262"/><defs><linearGradient id="a" x1="14.79" x2="89.489" y1="14.79" y2="80.397" gradientUnits="userSpaceOnUse"><stop/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="b" x1="85.238" x2="4.387" y1="85.237" y2="30.024" gradientUnits="userSpaceOnUse"><stop/><stop offset="1" stop-color="#fff"/></linearGradient></defs></svg>			
			<img src="/images/nodejs.svg" class="h-10 w-10"/>			
			<img src="/images/npm.svg" class="h-10 w-10"/>
			<img src="/images/sqlite.svg" class="h-10 w-10"/>
			<img src="/images/tailwind.svg" class="h-10 w-10"/>
			<img src="/images/typescript.svg" class="h-10 w-10"/>			
			<img src="/images/vim.svg" class="h-10 w-10"/>
		</div>
		<button id="addMockHistoryButton"
			class="block mx-auto mt-8 cursor-[url(/images/pointer.png),pointer] text-center text-yellow-600 p-2 rounded-lg hover:bg-gray-700">
			Add mock history
		</button>
	</div>
	`;
}
