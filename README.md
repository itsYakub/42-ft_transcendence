# ft_transcendence

The home page now has some dev buttons to make testing easier. The code they call is in the devTools.ts file.

Setup
Because this is an SPA using SSR the flow is pretty weird. When the user opens the page it loads everything fully. Every other action updates the page elements (the navbar and the content).

This causes a few problems.
Firstly, we can't depend on any specific element being on the page at any time. Secondly, after every navigation action the button listeners need to be re-registered as the reference to the previous button is lost. Lastly, every element needs to have a globally-unique id as all the frontend JS has to be loaded at the beginning.

Structure
I've set up the structure like this (It can be changed if it's confusing): the two main parts are the backend and frontend. Although they are both in TypeScript they can't really talk to each other except through API requests and responses.

Backend
-	pages: each "page" has its own folder. Some pages have routes, db access, etc. Look at app.ts to see how they are registered. frame and navbar are used to wrap every "page". The register/login dialogs are inside navbar.
-	user: files here handle user API requests (login, register, etc.)

Frontend
This is the public root, so any HTML urls should be relative to this (images/background.jpg, for example).
-	css, images: static files.
-	js: these are the files that set up the listeners for the frontend. They should be pretty light as the heavy lifting is done server-side. Look at index.ts addFunctions to see how it works.

Adding code to a page
The index.ts file has two important functions, navigate and addFunctions. The first is used to change the page of the app, and it handles all the buttons, url, etc. The second is where you need to hook any page-specific code. Create an exportable function wherein you set up all the page. Call this function from addFunctions.

Flow
Generally, this is what happens: the user clicks something on the frontend. Within that function an API request is made to the backend (either to a specific file in backend/pages or to an API endpoint). This handler can grab the current user from the access/refresh token. A bad user will have an "error" key with the message and an HTTP error code. Check for that if you need a logged-in user. Each HTML view is hard-coded in its matching .ts file.

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
- change handler returns to translatable references
- unknown routes
- check what happens if db down
