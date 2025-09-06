import type { WebSocket } from "@fastify/websocket"; import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { addTotpApp, addTotpEmail, checkTotp, disableTotp, verifyEmailTotp, verifyTotpApp } from "./totpApi.js";
import { changeAvatar, changeNick, changePassword, invalidateToken, logout } from "./accountApi.js";
import { nicknames, tournamentChats, userChats } from "./apiEndpoints.js";
import { connectToServerSocket } from "../sockets/serverSocket.js";
import { googleSignIn, registerGuest } from "./authApi.js";
import { addFoe, foesList, removeFoe } from "./foesApi.js";
import { addFriend, findFriend, friendsList, removeFriend } from "./friendsApi.js";
import { addMatchResult } from "./matchResultsApi.js";
import { getProfile } from "./profileApi.js";
import { addTournament, getTournament, getTournamentGamers, matchGamers, matchNicks, tournamentNicks, updateTournment } from "./tournamentApi.js";
import { chatsList, getChats, notificationsList } from "./userChatsApi.js";
import { loginUser, registerUser, usersList } from "./userApi.js";

export function registerEndpoints(fastify: FastifyInstance): void {
	fastify.get("/ws", { websocket: true }, (socket: WebSocket, request: FastifyRequest) => connectToServerSocket(socket, request));
	fastify.post("/api/totp/app", (request: FastifyRequest, reply: FastifyReply) => addTotpApp(request, reply));
	fastify.post("/api/totp/email", (request: FastifyRequest, reply: FastifyReply) => addTotpEmail(request, reply));
	fastify.post("/api/totp/app/verify", (request: FastifyRequest, reply: FastifyReply) => verifyTotpApp(request, reply));
	fastify.post("/api/totp/email/verify", (request: FastifyRequest, reply: FastifyReply) => verifyEmailTotp(request, reply));
	fastify.get("/api/totp/check", (request: FastifyRequest, reply: FastifyReply) => checkTotp(request, reply));
	fastify.post("/api/totp/disable", (request: FastifyRequest, reply: FastifyReply) => disableTotp(request, reply));

	fastify.post("/api/account/avatar", (request: FastifyRequest, reply: FastifyReply) => changeAvatar(request, reply));
	fastify.post("/api/account/password", (request: FastifyRequest, reply: FastifyReply) => changeNick(request, reply));
	fastify.post("/api/account/nick", (request: FastifyRequest, reply: FastifyReply) => changePassword(request, reply));
	fastify.post("/api/account/invalidate-token", (request: FastifyRequest, reply: FastifyReply) => invalidateToken(request, reply));
	fastify.get("/api/account/logout", (request: FastifyRequest, reply: FastifyReply) => logout(request, reply));

	fastify.get("/api/account/nicknames", (request: FastifyRequest, reply: FastifyReply) => nicknames(request, reply));
	fastify.get("/api/account/tournament-chats", (request: FastifyRequest, reply: FastifyReply) => tournamentChats(request, reply));
	fastify.get("/api/user-chats/:otherUserId", (request: FastifyRequest, reply: FastifyReply) => userChats(request, reply));

	fastify.get("/auth/google", (request: FastifyRequest, reply: FastifyReply) => googleSignIn(request, reply));
	fastify.post("/api/guest/register", (request: FastifyRequest, reply: FastifyReply) => registerGuest(request, reply));

	fastify.get("/api/foes", (request: FastifyRequest, reply: FastifyReply) => foesList(request, reply));
	fastify.post("/api/foes/add", (request: FastifyRequest, reply: FastifyReply) => addFoe(request, reply));
	fastify.post("/api/foes/remove", (request: FastifyRequest, reply: FastifyReply) => removeFoe(request, reply));

	fastify.get("/api/friends", (request: FastifyRequest, reply: FastifyReply) => friendsList(request, reply));
	fastify.post("/api/friends/add", (request: FastifyRequest, reply: FastifyReply) => addFriend(request, reply));
	fastify.post("/api/friends/remove", (request: FastifyRequest, reply: FastifyReply) => removeFriend(request, reply));
	fastify.post("/api/friends/find", (request: FastifyRequest, reply: FastifyReply) => findFriend(request, reply));

	fastify.post("/api/match-results/add", (request: FastifyRequest, reply: FastifyReply) => addMatchResult(request, reply));

	fastify.post("/api/profile", (request: FastifyRequest, reply: FastifyReply) => getProfile(request, reply));

	fastify.get("/api/tournament/gamers", (request: FastifyRequest, reply: FastifyReply) => getTournamentGamers(request, reply));
	fastify.get("/api/match/nicks", (request: FastifyRequest, reply: FastifyReply) => matchNicks(request, reply));
	fastify.get("/api/tournament/nicks", (request: FastifyRequest, reply: FastifyReply) => tournamentNicks(request, reply));
	fastify.get("/api/match/gamers", (request: FastifyRequest, reply: FastifyReply) => matchGamers(request, reply));
	fastify.get("/api/tournament", (request: FastifyRequest, reply: FastifyReply) => getTournament(request, reply));
	fastify.post("/api/tournament/add", (request: FastifyRequest, reply: FastifyReply) => addTournament(request, reply));
	fastify.post("/api/tournament/update", (request: FastifyRequest, reply: FastifyReply) => updateTournment(request, reply));

	fastify.get("/api/chats/notifications", (request: FastifyRequest, reply: FastifyReply) => notificationsList(request, reply));
	fastify.post("/api/chats", (request: FastifyRequest, reply: FastifyReply) => getChats(request, reply));
	fastify.post("/api/chats/users", (request: FastifyRequest, reply: FastifyReply) => chatsList(request, reply));

	fastify.get("/api/user", (request: FastifyRequest, reply: FastifyReply) => usersList(request, reply));
	fastify.post("/api/user/register", (request: FastifyRequest, reply: FastifyReply) => registerUser(request, reply));
	fastify.post("/api/user/login", (request: FastifyRequest, reply: FastifyReply) => loginUser(request, reply));
}

