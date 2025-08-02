import { navigate } from "./index.js";

export function devButtons() {
	const wipeAllButton = document.querySelector("#wipeAllButton")
	if (wipeAllButton) {
		wipeAllButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe", {
				method: "GET"
			});

			if (response.ok) {
				alert("Wiped and re-created DB!");
				navigate("/");
			}
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const wipeUsersButton = document.querySelector("#wipeUsersButton")
	if (wipeUsersButton) {
		wipeUsersButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe/users", {
				method: "GET"
			});
			if (response.ok)
				alert("Wiped users!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const wipeMatchesButton = document.querySelector("#wipeMatchesButton")
	if (wipeMatchesButton) {
		wipeMatchesButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe/matches", {
				method: "GET"
			});
			if (response.ok)
				alert("Wiped matches!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const wipeFriendsButton = document.querySelector("#wipeFriendsButton")
	if (wipeFriendsButton) {
		wipeFriendsButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe/friends", {
				method: "GET"
			});
			if (response.ok)
				alert("Wiped friends!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const wipeTournamentsButton = document.querySelector("#wipeTournamentsButton")
	if (wipeTournamentsButton) {
		wipeTournamentsButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe/tournaments", {
				method: "GET"
			});
			if (response.ok)
				alert("Wiped tournaments!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const addMockUsersButton = document.querySelector("#addMockUsersButton")
	if (addMockUsersButton) {
		addMockUsersButton.addEventListener("click", async () => {
			const response = await fetch("/dev/add/users", {
				method: "GET"
			});
			if (response.ok)
				alert("Added mock users!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const addMockMatchesButton = document.querySelector("#addMockMatchesButton")
	if (addMockMatchesButton) {
		addMockMatchesButton.addEventListener("click", async () => {
			const response = await fetch("/dev/add/matches", {
				method: "GET"
			});
			if (response.ok)
				alert("Added mock matches!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const addMockFriendsButton = document.querySelector("#addMockFriendsButton")
	if (addMockFriendsButton) {
		addMockFriendsButton.addEventListener("click", async () => {
			const response = await fetch("/dev/add/friends", {
				method: "GET"
			});
			if (response.ok)
				alert("Added mock friends!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}
}
