import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DatabaseSync } from "node:sqlite";
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { getUserById } from '../db/userDB.js';
import { matchResultsList } from '../db/matchResultsDb.js';
import { profileView } from '../views/profileView.js';
import { friendsList } from '../db/friendsDb.js';
import { foesList } from '../db/foesDb.js';

export function profileEndpoints(fastify: FastifyInstance, db: DatabaseSync) {
	fastify.post("/api/profile", async (request: FastifyRequest, reply: FastifyReply) => {
		const { userId } = request.body as any;
		const userBox = getUserById(db, userId);
		if (Result.SUCCESS != userBox.result)
			return reply.send(userBox);

		const user = userBox.contents;

		const matchResultsBox = matchResultsList(db, user.userId);

		if (Result.SUCCESS != matchResultsBox.result)
			return reply.send(matchResultsBox);

		const friendsBox = friendsList(db, request.user.userId);
		if (Result.SUCCESS != friendsBox.result)
			return reply.send(friendsBox);

		const foesBox = foesList(db, request.user.userId);
		if (Result.SUCCESS != foesBox.result)
			return reply.send(foesBox);

		const isFriend = null != friendsBox.contents.find(friend => friend.userId == user.userId);
		const isFoe = null != foesBox.contents.find(foe => foe.userId == user.userId);

		let text = profileView(matchResultsBox.contents, isFriend, isFoe, user);
		return reply.send({
			result: Result.SUCCESS,
			value: translate(request.language, text)
		});
	});
}
