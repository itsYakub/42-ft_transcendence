# ft_transcendence

Kuba:
The frontend/js/game.ts file has the entry function which starts the game in a modal dialog. Currently I have test buttons in there. Replace the buttons with your canvas or other elements. This HTML snippet lives in backend/pages/game/game.ts.
The function gets passed the two player names and an optional options object. This is what you'd fill up with whatever custom options you offer on the parent page.
When the match finishes call the endMatch function with the two scores and the second player's name and the database will be updated.

TODO (Luke):
- sanitise git repo
- generate key and cert with docker with other CN
- move key/cert
- add emails to cloud
- clean up tailwind
- replace online detection with websockets - and roomIDs
- delete guest on websocket disconnect?

Page endpoints (all GET)
-	/
-	/play
-	/tournament
-	/profile
-	/matches
-	/friends

User endpoints (all POST except /user/logout)
-	/user/register
-	/user/login
-	/user/logout
-	/user/invalidate-token
-	/user/totp/check
-	/user/leave

Profile endpoints (all POST)
-	/profile/nick
-	/profile/avatar
-	/profile/password
-	/profile/totp/enable
-	/profile/totp/disable
-	/profile/totp/verify

Friends endpoints (all POST)
-	/friends/add
-	/friends/remove
-	/friends/find
-	/user/leave

Game endpoints (all POST)
-	/match/add
-	/tournament/add
-	/tournament/update
-	/tournament/:id
