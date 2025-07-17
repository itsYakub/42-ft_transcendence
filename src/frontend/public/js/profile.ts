// minutes played, win/loss ratio, friends, change password/nick
import { navigate } from "./index.js";

export function registerProfileListeners() {
	const profileButton = document.getElementById("profileButton");
	if (profileButton) {
		profileButton.addEventListener("click", () => {
			navigate("/profile");
		}, { once: true });
	}

	const matchesButton = document.getElementById("matchesButton");
	if (matchesButton) {
		matchesButton.addEventListener("click", () => {
			navigate("/matches");
		}, { once: true });
	}

	const friendsButton = document.getElementById("friendsButton");
	if (friendsButton) {
		friendsButton.addEventListener("click", () => {
			navigate("/friends");
		}, { once: true });
	}
}
