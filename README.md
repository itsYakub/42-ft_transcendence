# ft_transcendence

Kuba:
The frontend/js/game.ts file has the entry function which starts the game in a modal dialog. Currently I have a test button in there which only makes sense if opened from a running tournament. Replace the button with your canvas or other elements. This HTML snippet lives in backend/pages/game/game.ts.
The function gets passed the two player names and an optional options object. This is what you'd fill up with whatever custom options you offer on the parent page.
When the match finishes call the endMatch function with the two scores and the tournament/database will be updated.

TODO (Luke):
- history not working properly
- handle params in history?
- sanitise git repo
- generate key and cert with docker
- SSL
- move key/cert
- add emails to cloud
- clean up tailwind
- unknown routes
- check what happens if db down
- check API replies to the browser - no leaking!
