export function getGame(request, reply) {
	return reply.view("game", { title: "Homepage" });
}

export function getTtt(request, reply) {
	return reply.view("ttt", { title: "Homepage" });
}
