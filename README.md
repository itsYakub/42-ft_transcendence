# ft_transcendence

Setup
Because this is an SPA using SSR the flow is pretty weird. When the user opens the page it loads everything fully. Every other action updates the page elements (the navbar and the content).

This causes a few problems.
Firstly, we can't depend on any specific element being on the page at any time. Secondly, after every navigation action the button listeners need to be re-registered as the reference to the previous button is lost. Lastly, every element needs to have a globally-unique id as all the frontend JS has to be loaded at the beginning.

Structure
I've set up the structure like this (It can be changed if it's confusing): the two main parts are the backend and frontend. Although they are both in TypeScript they can't really talk to each other except through API requests and responses.

Backend
-	admin: currently un-used, but if we have time and get bored it would be a place to edit user info without touching the DB directly.
-	db: the DB is the only class in the app (in my partm at least). All SQL statements should be here to avoid spreading them around.
-	db/views: these are the raw HTML "pages" that are displayed to the user. I've used %%NAME%% placeholders which are later programmatically replaced before the "page" is sent back. At the moment these are stored and retrieved in the db, but the final step will be to hard-code them as strings.
-	pages: these are the code-behind files, one per "page". Inside the route is set up and the function to inject user data. The frame and bavbar partials do a bit of extra work as they are more dynamic.
-	user: files here handle user API requests (login, register, etc.)

Frontend
This is the public root, so any HTML urls should be relative to this (images/background.jpg, for example).
-	css, images: static files.
-	js: these are the files that set up the listeners for the frontend. They should be pretty light as the heavy lifting is done server-side.

Adding code to a page
The index.ts file has two important functions, navigate and addFunctions. The first is used to change the page of the app, and it handles all the buttons, url, etc. The second is where you need to hook any page-specific code. Create an exportable function wherein you set up all the page. Call this function from addFunctions.

Flow
Generally, this is what happens: the user clicks something on the frontend. Within that function an API request is made to the backend (currently either to a specific file in backend/pages or to userEndpoints.ts). This handler can gra the current user from the access/refresh token. A bad user will have an "error" key with the message and an HTTP error code. Check for that if you need a logged-in user. The userHandler.ts file has functions which call functions in the DB class, then return a massaged output.

TODO (Luke):
- history not working properly
- handle params in history?
- sanitise git repo
- generate key and cert with docker
- SSL
- move key/cert
- add emails to cloud
- clean up tailwind
- colour scheme
