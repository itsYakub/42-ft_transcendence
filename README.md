# ft_transcendence

Kuba:
The frontend/js/game.ts file has the entry function which starts the game in a modal dialog. Currently I have a test button in there which only makes sense if opened from a running tournament. Replace the button with your canvas or other elements. This HTML snippet lives in backend/pages/game/game.ts.
The function gets passed the two player names and an optional options object. This is what you'd fill up with whatever custom options you offer on the parent page.
When the match finishes call the endMatch function with the two scores and the tournament/database will be updated.

TODO (Luke):
- sanitise git repo
- generate key and cert with docker
- move key/cert
- add emails to cloud
- clean up tailwind
- unknown routes
- check what happens if db down

Page endpoints (all GET)
-	/
-	/play
-	/tournament
-	/profile
-	/matches
-	/friends

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
