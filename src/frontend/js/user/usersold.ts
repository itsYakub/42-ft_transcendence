// import { Result, WebsocketMessageGroup, WebsocketMessageType } from "../../../common/interfaces.js";
// import { navigate, showAlert } from "../index.js";
// import { sendMessageToServer } from "../sockets/socket.js";
// import { accountFunctions } from "./account.js";

// export function usersFunctions() {

// 	const inviteButton = document.querySelector("#inviteButton");
// 	if (inviteButton) {
// 		inviteButton.addEventListener("click", async () => {
// 			const toButton = <HTMLButtonElement>document.querySelector("#selectedUserButton");
// 			if (toButton) {
// 				const response = await fetch(`/api/is-online/${toButton.dataset.id}`);
// 				const json = await response.json();
// 				if (Result.SUCCESS == json.result && 1 == json.online)
// 					sendMessageToServer({
// 						group: WebsocketMessageGroup.USER,
// 						type: WebsocketMessageType.INVITE,
// 						toId: parseInt(toButton.dataset.id),
// 					});
// 				else
// 					showAlert("ERR_USER_OFFLINE");
// 			}
// 		});
// 	}
