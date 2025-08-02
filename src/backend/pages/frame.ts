import { navbarHtml } from "./navbar.js";
import { translateBackend } from "./translations.js";

/*
	Returns the whole page, or an error page
*/
export function frameHtml(params: any, content: string = null): any {
	if (!content) {
		content = errorString(params);
	}
	const navbar = navbarString(params);
	return frameString(navbar, content);
}

/*
	Returns the navbar with the current "page" marked
*/
function navbarString(params: any) {
	let navbar = navbarHtml(params);

	const views = ["HOME", "PLAY", "TOURNAMENT"];

	views.forEach((value) => {
		if (value == params.page.toUpperCase())
			navbar = navbar.replace(`%%${value}_COLOUR%%`, "gray-700");
		else
			navbar = navbar.replace(`%%${value}_COLOUR%%`, "transparent");
	});

	return navbar;
}

function frameString(navbar: string, content: string): string {
	return `
	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			<link rel="icon" type="image/x-icon" href="/images/favicon.ico">
			<script type="module" src="/js/index.js"></script>
			<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
			<title>Transcendence</title>
		</head>

		<body>
			<div class="h-screen flex flex-col">
				<div id="navbar" class="h-32">${navbar}</div>
				<div id="content" class="grow">${content}</div>
			</div>
		</body>
	</html>
	`;
}

/*
	A frame with an error message body
*/
function errorString(params: any) {
	const message = translateBackend({
		language: params.language,
		text: params.errorMessage
	});

	return `
	<div class="h-full bg-gray-900 content-center text-center">
		<div class="text-white">${params.errorCode} - ${message}</div>
	</div>
	`;
}
