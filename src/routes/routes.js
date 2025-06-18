import { getIndex, getHome } from "../controllers/indexController.js";
import { getUsers, getNewUser } from "../controllers/userController.js";
import { getGame, getTtt } from "../controllers/gameController.js";

export default async function routes(fastify, options) {
	fastify.get("/*", getIndex);

	fastify.register(
		async function (apiRoutes) {
			apiRoutes.get("/home", getHome);
			apiRoutes.get("/users", getUsers);
			apiRoutes.get("/user/new", getNewUser);
			apiRoutes.get("/game", getGame);
			apiRoutes.get("/ttt", getTtt);
			// apiRoutes.get("/:id", getUser);
			// apiRoutes.get("/:id/edit", getEditUser);
			// apiRoutes.post("/", postNewUser);
			// apiRoutes.post("/:id/edit", postEditUser);
			// apiRoutes.post("/:id/delete", deleteUser);
		},
		{ prefix: "/api" }
	);

	//API routes - need auth
}
