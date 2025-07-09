import { setupRegisterForm } from "./register.js";
import { setupGameFrame } from "./game.js";

// Maps the routes to the button names, to update the colour
let buttonNames = new Map<string, string>();
buttonNames["/"] = "homeButton";
buttonNames["/game"] = "gameButton";
buttonNames["/tournament"] = "tournamentButton";
buttonNames["/login"] = "loginButton";

async function navigate(url: string): Promise<void> {
	history.pushState(null, null, url);

	// Fetches the data from the backend
	const response = await fetch(url, {
		method: "GET"
	});

	// Sets the index page's content
	if (response.ok) {
		const text = await response.text();
		document.querySelector("#content").innerHTML = text;
	}
}

function changeButtonColours(url: string): void {
	// Resets the text colour of all nav-button
	const collection = document.getElementsByClassName("nav-button");
	for (let i = 0; i < collection.length; i++) {
		collection[i].classList.replace("bg-gray-900", "bg-transparent");
	}

	// Makes this nav-button's text colour green
	var element = document.getElementById(buttonNames[url]);
	if (element)
		element.classList.replace("bg-transparent", "bg-gray-900");
}

function navButtonClicked(url: string): void {
	navigate(url);
	changeButtonColours(url);

	// Reset the register button
	var element = document.getElementById("registerButton");
	if (element)
		element.classList.replace("bg-gray-900", "bg-yellow-600");
};

document.getElementById("homeButton").addEventListener("click", () => {
	navButtonClicked("/");
});

document.getElementById("gameButton").addEventListener("click", async () => {
	await navigate("/game");
	setupGameFrame();
});

document.getElementById("tournamentButton").addEventListener("click", () => {
	navButtonClicked("/tournament");
});

function profileClicked() {
	// if logged in... else
	//navButtonClicked("register");
}

document.getElementById("registerButton").addEventListener("click", async () => {
	await navigate("/register");
	changeButtonColours("");
	var element = document.getElementById("registerButton");
	if (element)
		element.classList.replace("bg-yellow-600", "bg-gray-900");
	setupRegisterForm();
});

// Changes view on back/forward buttons
window.addEventListener('popstate', function (event) {
	navButtonClicked(window.location.pathname);
});
