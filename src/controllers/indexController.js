export function getIndex(request, reply) {
	console.log("Called index");
	return reply.view("index", { title: "Homepage" });
}

export function getHome(request, reply) {
	return reply.view("home", { title: "Homepage" });
}
