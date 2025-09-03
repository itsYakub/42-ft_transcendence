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
			<img src="/images/node.png" class="h-10 w-10"/>			
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
