export function chatHtml(user: any): string {
  return chatHtmlString;
}

const chatHtmlString: string = `
<div class="h-full bg-gray-900 content-center text-center text-white p-4">
  <!-- Chat messages display -->
  <div id="chatBox" class="mb-4 h-60 overflow-y-scroll bg-gray-800 p-2 rounded text-left max-w-xl mx-auto"></div>

  <!-- Message input + Send -->
  <div class="flex justify-center items-center space-x-2 mb-4">
    <input id="messageInput" type="text"
           class="text-white px-3 py-2 rounded w-1/2"
           placeholder="Type your message..." />
    <button type="button" id="sendMessageButton"
            class="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700">
      Send
    </button>
  </div>

  <!-- Invite to Pong -->
  <button type="button" id="inviteButton"
          class="mt-2 bg-blue-600 px-6 py-2 rounded hover:bg-blue-700">
    Invite to Pong
  </button>
</div>
`;
