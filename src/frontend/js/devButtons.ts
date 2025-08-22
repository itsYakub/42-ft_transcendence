import { navigate } from "./index.js";

export function devButtons() {
	const addMockUsersButton = document.querySelector("#addMockUsersButton")
	if (addMockUsersButton) {
		addMockUsersButton.addEventListener("click", async () => {
			const response = await fetch("/dev/add/users");
			if (response.ok)
				alert("Added mock users!");
			else
				alert("Something went wrong!");
		});
	}

	const addMockHistoryButton = document.querySelector("#addMockHistoryButton")
	if (addMockHistoryButton) {
		addMockHistoryButton.addEventListener("click", async () => {
			const response = await fetch("/dev/add/history");
			if (response.ok)
				alert("Added mock history!");
			else
				alert("Something went wrong!");
		});
	}

	const deleteCookiesButton = document.querySelector("#deleteCookiesButton")
	if (deleteCookiesButton) {
		deleteCookiesButton.addEventListener("click", async () => {
			document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
			const response = await fetch("/account/logout");
			if (response.ok)
				navigate("/");
		});
	}
}
