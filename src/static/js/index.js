// Updates the history and grabs the view data
const goToRoute = (url) => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {

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

async function navButtonClicked(url, id) {
	goToRoute(url);
	const collection = document.getElementsByClassName("selected");
	for (let i = 0; i < collection.length; i++) {
		collection[i].classList.toggle("selected");
	}
	var element = document.getElementById(id);
	element.classList.toggle("selected");
};

// Changes view on back/forward buttons
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {

	// Blocks the link from going to a new page when clicked
	// document.body.addEventListener("click", (e) => {
	// 	console.log(e.target);
	// 	if (e.target.matches("[data-link]")) {
	// 		e.preventDefault();
	// 		goToRoute(e.target.parent.href);
	// 	}
	// });

	router();
});

// Makes the function visible from the html file
window.navButtonClicked = navButtonClicked;
