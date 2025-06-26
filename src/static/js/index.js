// Updates the history and grabs the view data
const goToRoute = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	console.log("Router");
	const routes = [
		{ path: "/", view: "/api/home" },
		{ path: "/users", view: "/api/users" },
		{ path: "/game", view: "/api/game" },
	];

	const matchedRoute = routes.map(route => {
		return {
			route: route,
			isMatch: location.pathname === route.path
		};
	});

	let selectedRoute = matchedRoute.find(match => match.isMatch);

	if (!selectedRoute)
		selectedRoute = {
			route: routes[0],
			isMatch: true
		};

	// Updates the HTML without re-loading the page
	const url = selectedRoute.route.view;
	const response = await fetch(url);
	if (response.ok) {
		const text = await response.text();
		document.querySelector("#content").innerHTML = text;
	}
}

async function navButtonClicked(url, id, params = {}) {
	if (params.id)
		url = url + "/" + params.id;
	history.pushState(null, null, url);
	const response = await fetch(url + "?id=" + params.id, {
		method: "GET",
		headers: {
			"internal": true
		},
	});
	if (response.ok) {
		const text = await response.text();
		document.querySelector("#content").innerHTML = text;
	}

	//goToRoute(url);
	const collection = document.getElementsByClassName("text-green-700");
	for (let i = 0; i < collection.length; i++) {
		collection[i].classList.replace("text-green-700", "text-gray-500");
	}
	var element = document.getElementById(id);
	element.classList.replace("text-gray-500", "text-green-700");
};

// Changes view on back/forward buttons
//window.addEventListener("popstate", router);
window.addEventListener('popstate', function (event) {
	console.log("changing");
});
document.addEventListener("DOMContentLoaded", () => {
	//router();
	console.log("finished");
});

function showProfile() {

}

// Makes the function visible from the html file
window.showProfile = showProfile;
window.navButtonClicked = navButtonClicked;
