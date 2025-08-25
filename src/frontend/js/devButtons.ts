import { navigate } from "./index.js";
import { closeSocket } from "./sockets/socket.js";

export function devButtons() {
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
			const response = await fetch("/account/logout");
			document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
			if (response.ok) {
				closeSocket();
				navigate("/");
			}
		});
	}
}
