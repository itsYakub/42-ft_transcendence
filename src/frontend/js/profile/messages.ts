import { sendMessageToServer } from "../sockets/socket.js";

export function MessagesFunctions() {
	const messageButtons = document.getElementsByClassName("messageUserButton");
	for (var i = 0; i < messageButtons.length; i++) {
		messageButtons[i].addEventListener("click", async function () {
			const response = await fetch("/messages", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					otherID: this.dataset.id
				})
			});

			console.log(response);
		});
	}

	const sendMessageForm = <HTMLFormElement>document.querySelector("#sendMessageForm");
	if (sendMessageForm) {
		sendMessageForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const toID = e.submitter.dataset.id;
			const message = sendMessageForm.message.value;

			if (message.length > 0) {
				sendMessageToServer({
					type: "user-chat",
					toID,
					chat: message
				});
			}

			// if (sendMessageForm.message.value.length > 0) {
			// 	const response = await fetch("/messages/add", {
			// 		method: "POST",
			// 		body: JSON.stringify({
			// 			toID,
			// 			message: sendMessageForm.message.value
			// 		})
			// 	});
			// 	const json = await response.json();
			// 	if (json.code != 201) {
			// 		showAlert(json.error);
			// 		return;
			// 	}



			//navigate(window.location.href);

		});
	}
}
