// Maps the routes to the button names, to update the colour
let buttonNames = new Map<string, string>();
buttonNames["/"] = "homeButton";
buttonNames["/game"] = "gameButton";
buttonNames["/tournament"] = "tournamentButton";
buttonNames["/register"] = "registerButton";

async function navButtonClicked(url: string): Promise<void> {
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

	// Resets the text colour of all nav-button
	const collection = document.getElementsByClassName("nav-button");
	for (let i = 0; i < collection.length; i++) {
		collection[i].classList.replace("text-green-700", "text-gray-500");
	}

	// Makes this nav-button's text colour green
	var element = document.getElementById(buttonNames[url]);
	if (element)
		element.classList.replace("text-gray-500", "text-green-700");
};

function profileClicked() {
	// if logged in... else
	navButtonClicked("register");
}

// Changes view on back/forward buttons
window.addEventListener('popstate', function (event) {
	navButtonClicked(window.location.pathname);
});

window.profileClicked = profileClicked;
window.navButtonClicked = navButtonClicked;
