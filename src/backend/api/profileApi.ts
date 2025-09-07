import { FastifyRequest, FastifyReply } from 'fastify';
import { Result } from '../../common/interfaces.js';
import { translate } from '../../common/translations.js';
import { getUserById } from '../../db/userDB.js';
import { readMatchResults } from '../../db/matchResultsDb.js';
import { readFriends } from '../../db/friendsDb.js';
import { profileView } from '../../common/dynamicElements.js';
import { readFoes } from '../../db/foesDb.js';

export function getProfile(request: FastifyRequest, reply: FastifyReply) {
	const db = request.db;
	const { userId } = request.body as any;
	const userBox = getUserById(db, userId);
	if (Result.SUCCESS != userBox.result)
		return reply.send(userBox);

	const user = userBox.contents;

	const matchResultsBox = readMatchResults(db, user.userId);

	if (Result.SUCCESS != matchResultsBox.result)
		return reply.send(matchResultsBox);

	const friendsBox = readFriends(db, request.user.userId);
	if (Result.SUCCESS != friendsBox.result)
		return reply.send(friendsBox);

	const foesBox = readFoes(db, request.user.userId);
	if (Result.SUCCESS != foesBox.result)
		return reply.send(foesBox);

	const isFriend = null != friendsBox.contents.find(friend => friend.userId == user.userId);
	const isFoe = null != foesBox.contents.find(foe => foe.userId == user.userId);

	let text = profileView(matchResultsBox.contents, isFriend, isFoe, user, request.user);
	return reply.send({
		result: Result.SUCCESS,
		value: translate(request.language, text)
	});
}

export function getUser(request: FastifyRequest, reply: FastifyReply) {
	return reply.send({
		result: Result.SUCCESS,
		contents: request.user
	});
}
