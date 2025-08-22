import { navigate } from "./index.js";

export function devButtons() {
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
		});
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
		});
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
		});
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
		});
	}
}
