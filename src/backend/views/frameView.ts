import { navbarView } from "./navbarView.js";
import { translateBackend } from "../../common/translations.js";
import { FrameParams } from "../../common/interfaces.js";

/*
	Returns the whole page, or an error page
*/
export function frameView(params: FrameParams, content: string = null): any {
	if (!content)
		content = errorString(params);

	const text = frameString(navbarView(params), content);
	return translateBackend(params.language, text)
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
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css">
			<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
			<title>Transcendence</title>
		</head>

		<body>
			<div class="h-screen w-screen bg-gray-900 flex flex-col">
				<div id="navbar" class="h-32">${navbar}</div>
				<div class="w-200 mx-auto grow">
					<div class="flex flex-row grow h-full">
						<div id="content" class="grow">${content}</div>
					</div>
				</div>
			</div>
		</body>
	</html>
	`;
}

/*
	A frame with an error message body
*/
function errorString(params: FrameParams) {
	return `
	<div class="h-full bg-gray-900 content-center text-center">
		<div class="text-white">%%${params.result}%%</div>
	</div>
	`;
}
