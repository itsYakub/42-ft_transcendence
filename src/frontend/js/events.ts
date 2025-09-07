// import { MessageType, Page, Result } from "../../common/interfaces.js";
// import { addListeners, showAlert, showPage } from "./index.js";
// import { initClientSocket, isConnected, sendMessageToServer } from "./sockets/clientSocket.js";

// export async function navigated() {
// 	if (!isConnected()) {
// 		//const userResponse = await fetch("/profile/user");
// 		//const userBox = await userResponse.json();
// 		//const user = userBox.contents;
// 		//if (Result.SUCCESS == userBox.result) {
// 		try {
// 			await initClientSocket();
// 			sendMessageToServer({
// 				type: MessageType.USER_CONNECT,
// 			});
// 		} catch (err) {
// 			console.error("❌ WebSocket failed:", err);
// 		}
// 		//}
// 	}

// 	//TODO fix
// 	// if ("game" != currentPage() && user.userType != UserType.GUEST) {
// 	// 	if (user.gameId?.startsWith("m"))
// 	// 		sendMessageToServer({
// 	// 			type: MessageType.MATCH_LEAVE
// 	// 		});
// 	// 	// sendMessageToServer({
// 	// 	// 	type: MessageType.USER_UNREADY
// 	// 	// });
// 	// }
// }

// export function registerEvents() {
// 	if (typeof window !== "undefined") {
// 		/* 
// 			Changes page on back/forward buttons
// 		*/
// 		window.addEventListener
// 			('popstate', (event) => {
// 				if (history.state)
// 					showPage(Page[history.state], false);
// 			});

// 		/*
// 			Registers the functions and also shows an error if Google sign-in/up was unsuccessful
// 		*/
// 		window.addEventListener("DOMContentLoaded", () => {
// 			if (-1 != document.cookie.indexOf("googleautherror=true")) {
// 				showAlert(Result.ERR_GOOGLE);
// 				document.cookie = `googleautherror=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/;`;
// 			}
// 			addListeners();
// 			navigated();
// 		});
// 	}
// }
