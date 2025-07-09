import { setupRegisterForm } from "./register.js";

// Maps the routes to the nav-button names, to update the colour
let buttonNames = new Map<string, string>();
buttonNames["/"] = "homeButton";
buttonNames["/game"] = "gameButton";
buttonNames["/tournament"] = "tournamentButton";
buttonNames["/login"] = "loginButton";

export async function navigate(url: string): Promise<void> {
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

function changeButtonColours(url: string = ""): void {
	// Resets the text colour of all nav-buttons
	const collection = document.getElementsByClassName("nav-button");
	for (let i = 0; i < collection.length; i++) {
		collection[i].classList.replace("bg-gray-900", "bg-transparent");
	}

	// If it's a nav-button change it to selected
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

document.getElementById("gameButton").addEventListener("click", () => {
	//navButtonClicked("/game");
	getUser();
});

document.getElementById("tournamentButton").addEventListener("click", () => {
	navButtonClicked("/tournament");
});

document.getElementById("registerButton").addEventListener("click", async () => {
	await navigate("/register");
	changeButtonColours();
	var element = document.getElementById("registerButton");
	if (element)
		element.classList.replace("bg-yellow-600", "bg-gray-900");
	setupRegisterForm();
});

document.getElementById("logoutButton").addEventListener("click", async () => {
	document.dispatchEvent(new Event("logout"));
	// delete cookie
	//redirect to home
});

async function getUser() {
	let jwt: string;
	document.cookie.split(";").forEach((c) => {
		if (c.substring(0, 4) == "jwt=")
			jwt = c.substring(4);
	});
	const response = await fetch("/user", { method: "GET" });
	const json = await response.json();
	if (0 != Object.keys(json).length) {
		console.log(json);
		document.dispatchEvent(new Event("login"));
		document.getElementById("profileNick").innerText = json.nick;
		const img = <HTMLImageElement>document.getElementById("profilePic");
		img.src = `images/${json.profilePic}`;
	}
	else {
		document.dispatchEvent(new Event("logout"));
	}
}

// Changes view on back/forward buttons
window.addEventListener('popstate', function (event) {
	navButtonClicked(window.location.pathname);
});

document.addEventListener("login", (e) => {
	const loginSection = document.getElementById("login");
	loginSection.classList.replace("visible", "collapse");
	const logoutSection = document.getElementById("logout");
	logoutSection.classList.replace("collapse", "visible");
});

document.addEventListener("logout", (e) => {
	const loginSection = document.getElementById("login");
	loginSection.classList.replace("collapse", "visible");
	const logoutSection = document.getElementById("logout");
	logoutSection.classList.replace("visible", "collapse");

	document.getElementById("profileNick").innerText = "";
	const img = <HTMLImageElement>document.getElementById("profilePic");
	img.src = "images/profilePic.jpg";
});
