import { navigate, showAlert } from "./index.js";

export function MessagesFunctions() {
	const messageButtons = document.getElementsByClassName("messageUserButton");
	for (var i = 0; i < messageButtons.length; i++) {
		messageButtons[i].addEventListener("click", async function () {
			navigate(`/messages/${this.dataset.id}`);
		});
	}

	const sendMessageForm = <HTMLFormElement>document.querySelector("#sendMessageForm");
	if (sendMessageForm) {
		sendMessageForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const toID = e.submitter.dataset.id;
			if (sendMessageForm.message.value.length > 0) {
				const response = await fetch("/messages/add", {
					method: "POST",
					body: JSON.stringify({
						toID,
						message: sendMessageForm.message.value
					})
				});
				const json = await response.json();
				if (json.code != 201) {
					showAlert(json.error);
					return;
				}

				navigate(window.location.href);
			}
		});
	}
}
