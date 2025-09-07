import { MessageType, Page, Result } from "../../common/interfaces.js";
import { showPage } from "./index.js";
import { sendMessageToServer } from "./sockets/clientSocket.js";

export function devButtons() {
	const deleteCookiesButton = document.querySelector("#deleteCookiesButton")
	if (deleteCookiesButton) {
		deleteCookiesButton.addEventListener("click", async () => {			
			const response = await fetch("/auth/logout", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({})
			});
			const result = await response.text();
			if (Result.SUCCESS == result) {
				document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
				showPage(Page.HOME)
			}
		});
	}
}
