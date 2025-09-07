import { Page, Result } from "../../common/interfaces.js";
import { showPage } from "./index.js";

export function devButtons() {
	const deleteCookiesButton = document.querySelector("#deleteCookiesButton")
	if (deleteCookiesButton) {
		deleteCookiesButton.addEventListener("click", async () => {
			const response = await fetch("/auth/logout");
			const result = await response.text();
			if (Result.SUCCESS == result) {
				document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
				showPage(Page.HOME)
			}
		});
	}
}
