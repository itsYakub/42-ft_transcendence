import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { friendsList } from '../db/friendsDb.js';
import { friendsView } from '../views/friendsView.js';
import { frameView } from '../views/frameView.js';
import { Result } from '../../common/interfaces.js';

export function friendsRoutes(fastify: FastifyInstance, db: DatabaseSync): void {
	fastify.get('/friends', async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;

		const friendsBox = friendsList(db, user);
		if (Result.SUCCESS != friendsBox.result) {
			const params = {
				user,
				language,
				result: friendsBox.result,
			};
			return reply.type("text/html").send(frameView(params));
		}

		const frame = frameView({ user, language }, friendsView(friendsBox.friends, user));
		return reply.type("text/html").send(frame);
	});

	fastify.post("/friends", async (request: FastifyRequest, reply: FastifyReply) => {
		const user = request.user;
		const language = request.language;
		const { selectedUserId: selectedFriendId } = request.body as any;
		const friendsBox = friendsList(db, user);
		if (Result.SUCCESS != friendsBox.result) {
			const params = {
				user,
				language,
				result: friendsBox.result,
			};
			return reply.type("text/html").send(frameView(params));
		}

		const selectedFriend = friendsBox.friends.find(friend => friend.friendId == selectedFriendId);
		return reply.type("text/html").send(JSON.stringify({
			result: Result.SUCCESS,
			value: friendsView(friendsBox.friends, user, selectedFriend)}));
	});
}
