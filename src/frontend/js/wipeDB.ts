import { addFunctions } from "./index.js";

export function wipeDB() {
	let deleteButton = document.getElementById("deleteButton")
	if (deleteButton) {
		deleteButton.addEventListener("click", async () => {
			//drop and recreate tables, log out, delete cookie
			const response = await fetch("/delete", {
				method: "GET"
			});

			// Sets the frame's navbar and content
			if (response.ok) {
				const text = await response.json();
				document.querySelector("#navbar").innerHTML = text.navbar;
				document.querySelector("#content").innerHTML = text.content;
				addFunctions();
			}
		}, { once: true });
	}
}
