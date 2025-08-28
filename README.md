# ft_transcendence

TODO (Luke):
- sanitise git repo
- clean up tailwind
- delete tournaments when finished
- tournament next-match gatekeeping
- check and protect all responses
- move scrollbar hiding to css file
- 2FA emails
- chat indicators - persist?
- delete accessToken check messages
- remove user.ready
- block DMs

TODO (Kuba):
- synchronise game start on remote - start button?

Socket messages
The Message interface is in common/interfaces.ts. Any field you add should be optional so it doesn't affect other messages. I've used present tense for the MessageTypes but you can name them however you want.
The server socket entry point is in backend/sockets/serverSocket.ts, function handleClientMessage. It's a simple switch which sends the message to the relevant function in different files. Feel free to either create a new file or add functions to one of the existing ones. In the same file is the function broadcastMessageToClients, which you call to send the same message to all connected clients.

The client socket entry point is in frontend/sockets/clientSocket.ts, function handleServerMessage. The structure is pretty much the same, with a switch sending the message to the relevant function. The corresponding function is sendMessageToServer. Because all clients get the same message you can use the fromId, toId, and gameId fields to filter out clients that aren't relevant.



Tests:
- not logged in
	log in
	register
	google
	guest

- user
	change password

- user
  google
	change nick
	change avatar
	enable totp
	disable totp
	send chat
	receive chat
	view profile
	add friend
	block
	remove friend
	remove block
	invite

- user
  google
  guest
	log out
	invalidate token
	create game
	join game
	leave game
	send chat
	receive chat
