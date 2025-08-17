export function handlePrivateChatMessage(user: any, message: any) {
	switch (message.type) {
		case "user-chat":
			userChat(user, message);
			break;
	}
}

function userChat(user: any, message: any) {
	
}
