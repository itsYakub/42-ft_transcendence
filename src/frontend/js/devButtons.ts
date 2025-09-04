import { navigate } from "./index.js";
import { closeSocket } from "./sockets/clientSocket.js";

export function devButtons() {
	const deleteCookiesButton = document.querySelector("#deleteCookiesButton")
	if (deleteCookiesButton) {
		deleteCookiesButton.addEventListener("click", async () => {
			const response = await fetch("/api/account/logout");
			document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
			if (response.ok) {
				closeSocket();
				navigate("/");
			}
		});
	}
}
