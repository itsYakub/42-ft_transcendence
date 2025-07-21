import { navigate } from "./index.js";

export function pageButtons() {
	document.getElementById("homeButton").addEventListener("click", () => {
		navigate("/");
	}, { once: true });

	document.getElementById("playButton").addEventListener("click", async () => {
		navigate("/play");
	}, { once: true });

	document.getElementById("tournamentButton").addEventListener("click", () => {
		navigate("/tournament");
	}, { once: true });

	let profileAvatar = document.getElementById("profileAvatar");
	if (profileAvatar) {
		profileAvatar.addEventListener("click", async () => {
			await navigate("/profile");
		}, { once: true });
	}
	
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
