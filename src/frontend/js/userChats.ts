export function userChatsFunctions() {
	const chatPartnerButtons = document.getElementsByClassName("chatPartnerButton");
	for (var i = 0; i < chatPartnerButtons.length; i++) {
		chatPartnerButtons[i].addEventListener("click", async function () {
			// const response = await fetch("/api/foes/remove", {
			// 	method: "POST",
			// 	headers: {
			// 		"content-type": "application/json"
			// 	},
			// 	body: JSON.stringify({
			// 		foeId: parseInt(this.dataset.id),
			// 	})
			// });

			// const text = await response.text();
			// if (Result.SUCCESS != text)
			// 	return;

			// ((this as HTMLElement).closest(".foeButton") as HTMLElement).style = "display: none;";
		});
	}


	const sendUserChatForm = <HTMLFormElement>document.querySelector("#sendUserChatForm");
	if (sendUserChatForm) {
		sendUserChatForm.addEventListener("submit", async (e) => {
			e.preventDefault();
		})
	}
}
