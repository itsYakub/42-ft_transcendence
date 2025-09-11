import { closeClientSocket } from "./sockets/clientSocket.js";

export function devButtons() {
	document.querySelector("#deleteCookiesButton")?.addEventListener("click", async () => {
		closeClientSocket();
		document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
	});
}
