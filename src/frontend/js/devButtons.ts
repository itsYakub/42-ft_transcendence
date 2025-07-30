import { addFunctions } from "./index.js";

export function devButtons() {
	const wipeAllButton = document.getElementById("wipeAllButton")
	if (wipeAllButton) {
		wipeAllButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe", {
				method: "GET"
			});

			if (response.ok) {
				const text = await response.json();
				document.querySelector("#navbar").innerHTML = text.navbar;
				document.querySelector("#content").innerHTML = text.content;
				addFunctions();
				alert("Wiped and re-created DB!");
			}
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const wipeUsersButton = document.getElementById("wipeUsersButton")
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

	const wipeMatchesButton = document.getElementById("wipeMatchesButton")
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

	const wipeFriendsButton = document.getElementById("wipeFriendsButton")
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

	const addMockUsersButton = document.getElementById("addMockUsersButton")
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

	const addMockMatchesButton = document.getElementById("addMockMatchesButton")
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

	const addMockFriendsButton = document.getElementById("addMockFriendsButton")
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

	const testButton = document.getElementById("testButton")
	if (testButton) {
		testButton.addEventListener("click", async () => {
			document.dispatchEvent(new Event("build"));
		}, { once: true });
	}
}
