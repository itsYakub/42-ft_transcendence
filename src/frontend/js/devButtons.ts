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
			if (response.ok) {
				alert("Wiped users!");
				navigate("/");
			}
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const wipeHistoryButton = document.querySelector("#wipeHistoryButton")
	if (wipeHistoryButton) {
		wipeHistoryButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe/history", {
				method: "GET"
			});
			if (response.ok)
				alert("Wiped history!");
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

	const wipeMessagesButton = document.querySelector("#wipeMessagesButton")
	if (wipeMessagesButton) {
		wipeMessagesButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe/messages", {
				method: "GET"
			});
			if (response.ok)
				alert("Wiped messages!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}

	const wipeRoomsButton = document.querySelector("#wipeRoomsButton")
	if (wipeRoomsButton) {
		wipeRoomsButton.addEventListener("click", async () => {
			const response = await fetch("/dev/wipe/rooms", {
				method: "GET"
			});
			if (response.ok)
				alert("Wiped rooms!");
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

	const addMockHistoryButton = document.querySelector("#addMockHistoryButton")
	if (addMockHistoryButton) {
		addMockHistoryButton.addEventListener("click", async () => {
			const response = await fetch("/dev/add/history", {
				method: "GET"
			});
			if (response.ok)
				alert("Added mock history!");
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

	const addMockMessagesButton = document.querySelector("#addMockMessagesButton")
	if (addMockMessagesButton) {
		addMockMessagesButton.addEventListener("click", async () => {
			const response = await fetch("/dev/add/messages", {
				method: "GET"
			});
			if (response.ok)
				alert("Added mock messages!");
			else
				alert("Something went wrong!");
		}, { once: true });
	}
}
