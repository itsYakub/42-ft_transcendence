/*
	This is the HTML that hosts the game. You can add ids and adjust anything at run time if needed
*/
export function gameHtmlString(): string {
	return `
	<dialog id="gameDialog" class="w-8/10 h-8/10 m-auto text-center content-center rounded-lg shadow border bg-gray-900 border-gray-100">

	<!-- Put your canvas or whatever else here instead -->
		<button id="winMatchButton" class="text-white bg-gray-800 border border-gray-700 block mx-auto cursor-pointer text-center p-2 rounded-lg hover:bg-gray-700"></button>
		<button id="loseMatchButton" class="mt-8 text-white bg-gray-800 border border-gray-700 block mx-auto cursor-pointer text-center p-2 rounded-lg hover:bg-gray-700"></button>
	<!-- -->

	</dialog>
	`;
}
