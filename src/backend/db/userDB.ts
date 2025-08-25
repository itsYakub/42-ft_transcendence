import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { compareSync } from "bcrypt-ts";
import { accessToken, hashPassword, refreshToken, validJWT } from "./jwt.js";
import { defaultAvatar } from "./defaultAvatar.js";
import { Result, UserBox, User, UserType, Box } from "../../common/interfaces.js";

/*
	Sets up the Users table
*/
export function initUsersDb(db: DatabaseSync, addUsers: number = 0): void {
	db.exec(`DROP TABLE IF EXISTS users;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
		avatar TEXT,
		email TEXT,
		game_id TEXT,
		nick TEXT UNIQUE NOT NULL,
		online INTEGER NOT NULL DEFAULT 0,
		password TEXT,
		playing INTEGER NOT NULL DEFAULT 0,
		ready INTEGER NOT NULL DEFAULT 0,
		refresh_token TEXT UNIQUE,
		totp_email INTEGER NOT NULL DEFAULT 0,
		totp_enabled INTEGER NOT NULL DEFAULT 0,
		totp_secret TEXT,
		totp_verified INTEGER NOT NULL DEFAULT 0,
		type TEXT DEFAULT USER,
		user_id INTEGER PRIMARY KEY AUTOINCREMENT
		);`);

	if (addUsers > 0) {
		const pw = hashPassword("12345678");
		for (var i = 1; i <= addUsers; i++)
			db.exec(`INSERT INTO users (nick, email, password, avatar) VALUES ('${getNickname(db).contents}', 'test${i}@test.com', '${pw}', '${defaultAvatar}');`);
	}
}

/*
	Gets a user using the refresh token if it's still valid
*/
function getUserByRefreshToken(db: DatabaseSync, refreshToken: string): UserBox {
	const valid = validJWT(refreshToken);
	if (valid) {
		let payload = refreshToken.split(".")[1];
		payload = atob(payload);
		const { exp } = JSON.parse(payload);
		const date = new Date(exp);
		if (date < new Date())
			return {
				result: Result.ERR_EXPIRED_TOKEN
			};

		const select = db.prepare("SELECT * FROM users WHERE refresh_token = ?");
		const user = select.get(refreshToken);
		if (!user) {
			return {
				result: Result.ERR_NO_USER
			}
		}
		return {
			result: Result.SUCCESS,
			user: sqlToUser(user)
		};
	}
	return {
		result: Result.ERR_NO_USER
	}
}

/*
	Returns a complete user from the DB
*/
export function getUser(db: DatabaseSync, accessToken: string, refreshToken: string): UserBox {
	try {
		const valid = validJWT(accessToken);
		if (valid) {
			let payload = accessToken.split(".")[1];
			payload = atob(payload);
			const { sub, exp } = JSON.parse(payload);
			const date = new Date(exp);
			if (date < new Date()) {
				return getUserByRefreshToken(db, refreshToken);
			}

			const select = db.prepare("SELECT * FROM users WHERE user_id = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					result: Result.ERR_NO_USER
				};
			}
			return {
				result: Result.SUCCESS,
				user: sqlToUser(user)
			};
		}
		else
			return getUserByRefreshToken(db, refreshToken);
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		}
	}
}

/*
	Adds a user to the DB after a sign up with email/password
*/
export function addUser(db: DatabaseSync, { email, password }): UserBox {
	try {
		const stringBox = getNickname(db);
		if (Result.SUCCESS != stringBox.result)
			return stringBox;

		const pw = hashPassword(password);
		const insert = db.prepare('INSERT INTO users (nick, email, password, avatar) VALUES (?, ?, ?, ?)');
		const statementSync = insert.run(stringBox.contents, email, pw, defaultAvatar);

		const userId: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(userId);
		updateRefreshtoken(db, {
			userId, refreshToken: token
		});
		return {
			result: Result.SUCCESS,
			accessToken: accessToken(userId),
			refreshToken: token
		};
	}
	catch (e) {
		if ("constraint failed" == e.errstr) {
			return {
				result: Result.ERR_EMAIL_IN_USE
			}
		}
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Adds a guest to the DB
*/
export function addGuest(db: DatabaseSync): Box<string> {
	try {
		const stringBox = getNickname(db);
		if (Result.SUCCESS != stringBox.result)
			return stringBox;

		const insert = db.prepare('INSERT INTO users (nick, type) VALUES (?, ?)');
		const statementSync = insert.run(stringBox.contents, UserType[UserType.GUEST]);
		const id: number = statementSync.lastInsertRowid as number;
		return {
			result: Result.SUCCESS,
			contents: refreshToken(id)
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	After a successful Google Sign-in/up, gets the user from the DB or adds it
*/
export function addGoogleUser(db: DatabaseSync, { email, avatar }): UserBox {
	try {
		let userBox = getUserByEmail(db, email);
		if (Result.SUCCESS == userBox.result) {
			const token = refreshToken(userBox.user.userId);
			updateRefreshtoken(db, {
				userId: userBox.user.userId,
				refreshToken: token
			});
			return {
				result: Result.SUCCESS,
				accessToken: accessToken(userBox.user.userId),
				refreshToken: token
			};
		}

		const stringBox = getNickname(db);
		if (Result.SUCCESS != stringBox.result)
			return stringBox;

		const insert = db.prepare('INSERT INTO users (nick, email, avatar, type) VALUES (?, ?, ?, ?)');
		const statementSync = insert.run(stringBox.contents, email, avatar, UserType[UserType.GOOGLE]);
		const userId: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(userId);
		updateRefreshtoken(db, {
			userId,
			refreshToken: token
		});
		return {
			result: Result.SUCCESS,
			accessToken: accessToken(userId),
			refreshToken: token
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Gets a user from the DB after an email/password login
*/
export function loginUser(db: DatabaseSync, { email, password }): UserBox {
	try {
		const userBox = getUserByEmail(db, email);
		if (Result.SUCCESS != userBox.result)
			return userBox;

		const user = userBox.user;

		if (compareSync(password, user.password)) {
			const token = refreshToken(user.userId);
			updateRefreshtoken(db, {
				userId: user.userId, refreshToken: token
			});
			return {
				result: Result.SUCCESS,
				user,
				accessToken: accessToken(user.userId),
				refreshToken: token
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Gets a user from the DB after an email/password login
*/
export function loginUserWithTOTP(db: DatabaseSync, { email, password, code }): UserBox {
	try {
		const userBox = getUserByEmail(db, email);
		if (Result.SUCCESS != userBox.result) {
			return userBox;
		}

		const user = userBox.user;

		// let totp = new OTPAuth.TOTP({
		// 			issuer: "Transcendence",
		// 			label: user.email,
		// 			algorithm: "SHA256",
		// 			digits: 6,
		// 			period: 30,
		// 			secret: user.totpSecret,
		// 		});

		// 		const params = JSON.parse(request.body as string);
		// 		if (null == totp.validate({ token: params.code, window: 1 })) {

		if (compareSync(password, user.password)) {
			const token = refreshToken(user.userId);
			updateRefreshtoken(db, {
				userId: user.userId, refreshToken: token
			});
			return {
				result: Result.SUCCESS,
				accessToken: accessToken(user.userId),
				refreshToken: token,
				user
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

// Finds the user in the DB by email
export function getUserById(db: DatabaseSync, userId: number): UserBox {
	try {
		const select = db.prepare("SELECT * FROM users WHERE user_id = ?");
		const user = select.get(userId);
		if (user) {
			return {
				result: Result.SUCCESS,
				user: sqlToUser(user)
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

// Finds the user in the DB by email
export function getUserByEmail(db: DatabaseSync, email: string): UserBox {
	try {
		const select = db.prepare("SELECT * FROM users WHERE email = ?");
		const user = select.get(email);
		if (user) {
			return {
				result: Result.SUCCESS,
				user: sqlToUser(user)
			}
		}
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*

*/
export function isUserOnline(db: DatabaseSync, userId: number): Box<boolean> {
	try {
		const select = db.prepare("SELECT online FROM users WHERE user_id = ?");
		const user = select.get(userId);
		if (user) {
			return {
				result: Result.SUCCESS,
				contents: Boolean(user.online)
			}
		};
		return {
			result: Result.ERR_NO_USER
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

export function updateRefreshtoken(db: DatabaseSync, { userId, refreshToken }): Result {
	try {
		const select = db.prepare("UPDATE users SET refresh_token = ? WHERE user_id = ?");
		select.run(refreshToken, userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function invalidateToken(db: DatabaseSync, userId: number): Result {
	try {
		const select = db.prepare("UPDATE users SET refresh_token = NULL WHERE user_id = ?");
		select.run(userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function markUserOnline(db: DatabaseSync, userId: number): Result {
	try {
		const select = db.prepare("UPDATE Users SET online = 1 WHERE user_id = ?");
		select.run(userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

export function markUserOffline(db: DatabaseSync, userId: number): Result {
	try {
		const select = db.prepare("UPDATE users SET online = 0 WHERE user_id = ?");
		// const select = "guest" == type ? db.prepare("DELETE FROM Users WHERE UserID = ?") :
		// 	db.prepare("UPDATE Users SET Online = 0 WHERE UserID = ?");
		select.run(userId);
		return Result.SUCCESS;
	}
	catch (e) {
		return Result.ERR_DB;
	}
}

/*
	Returns a list of all nicknames currently in the DB
*/
export function allNicknames(db: DatabaseSync): Box<string[]> {
	try {
		const select = db.prepare("SELECT nick FROM users");
		const list = select.all();

		let nicknames = [];
		list.forEach((user) => {
			nicknames.push(user.Nick);
		});

		return {
			result: Result.SUCCESS,
			contents: nicknames
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}


/*
	Returns a list of all nicknames currently in the DB
*/
export function allUsers(db: DatabaseSync): Box<string[]> {
	try {
		const select = db.prepare("SELECT user_id, nick FROM users");
		const list = select.all();

		let users = [];
		list.forEach((user) => {
			users.push({
				id: user.UserID,
				nick: user.Nick
			});
		});

		return {
			result: Result.SUCCESS,
			contents: users
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

/*
	Returns a list of all nicknames currently in the DB
*/
export function allOtherUsers(db: DatabaseSync, user: User): Box<User[]> {
	if (UserType.GUEST == user.userType) {
		return {
			result: Result.ERR_FORBIDDEN
		};
	}
	try {
		const select = db.prepare("SELECT * FROM users WHERE ? != user_id ORDER BY nick");
		const users = select.all(user.userId).map(user => sqlToUser(user));

		return {
			result: Result.SUCCESS,
			contents: users
		};
	}
	catch (e) {
		return {
			result: Result.ERR_DB
		};
	}
}

function getNickname(db: DatabaseSync): Box<string> {
	const response = allNicknames(db);
	if (Result.SUCCESS != response.result)
		return {
			result: response.result
		};

	let nickname = generateNickname();
	while (response.contents.includes(nickname))
		nickname = generateNickname();

	return {
		result: Result.SUCCESS,
		contents: nickname
	};
}

function generateNickname(): string {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const animal = animals[Math.floor(Math.random() * animals.length)];

	return `${adjective} ${animal}`;
}

function sqlToUser(sqlUser: Record<string, SQLOutputValue>): User {
	return {
		avatar: sqlUser.avatar as string,
		email: sqlUser.email as string,
		gameId: sqlUser.game_id as string,
		nick: sqlUser.nick as string,
		online: Boolean(sqlUser.online as number),
		password: sqlUser.password as string,
		playing: Boolean(sqlUser.playing as number),
		ready: Boolean(sqlUser.ready as number),
		refreshToken: sqlUser.refresh_token as string,
		totpEmail: Boolean(sqlUser.totp_email as number),
		totpEnabled: Boolean(sqlUser.totp_enabled as number),
		totpSecret: sqlUser.totp_secret as string,
		totpVerified: Boolean(sqlUser.totp_verified as number),
		userType: UserType[sqlUser.type as string],
		userId: sqlUser.user_id as number
	};
}

const adjectives = [
	"Aristotelian",
	"Arthurian",
	"Bohemian",
	"Brethren",
	"Mosaic",
	"Oceanic",
	"Proctor",
	"Terran",
	"Tudor",
	"Abroad",
	"Absorbing",
	"Abstract",
	"Academic",
	"Accelerated",
	"Accented",
	"Accountant",
	"Acquainted",
	"Acute",
	"Addicting",
	"Addictive",
	"Adjustable",
	"Admired",
	"Adult",
	"Adverse",
	"Advised",
	"Aerosol",
	"Afraid",
	"Aggravated",
	"Aggressive",
	"Agreeable",
	"Alienate",
	"Aligned",
	"All-round",
	"Alleged",
	"Almond",
	"Alright",
	"Altruistic",
	"Ambient",
	"Ambivalent",
	"Amiable",
	"Amino",
	"Amorphous",
	"Amused",
	"Anatomical",
	"Ancestral",
	"Angelic",
	"Angrier",
	"Answerable",
	"Antiquarian",
	"Antiretroviral",
	"Appellate",
	"Applicable",
	"Apportioned",
	"Approachable",
	"Appropriated",
	"Archer",
	"Aroused",
	"Arrested",
	"Assertive",
	"Assigned",
	"Athletic",
	"Atrocious",
	"Attained",
	"Authoritarian",
	"Autobiographical",
	"Avaricious",
	"Avocado",
	"Awake",
	"Awesome",
	"Backstage",
	"Backwoods",
	"Balding",
	"Bandaged",
	"Banded",
	"Banned",
	"Barreled",
	"Battle",
	"Beaten",
	"Begotten",
	"Beguiled",
	"Bellied",
	"Belted",
	"Beneficent",
	"Besieged",
	"Betting",
	"Big-money",
	"Biggest",
	"Biochemical",
	"Bipolar",
	"Blackened",
	"Blame",
	"Blessed",
	"Blindfolded",
	"Bloat",
	"Blocked",
	"Blooded",
	"Blue-collar",
	"Blushing",
	"Boastful",
	"Bolder",
	"Bolstered",
	"Bonnie",
	"Bored",
	"Boundary",
	"Bounded",
	"Bounding",
	"Branched",
	"Brawling",
	"Brazen",
	"Breeding",
	"Bridged",
	"Brimming",
	"Brimstone",
	"Broadest",
	"Broiled",
	"Broker",
	"Bronze",
	"Bruising",
	"Buffy",
	"Bullied",
	"Bungling",
	"Burial",
	"Buttery",
	"Candied",
	"Canonical",
	"Cantankerous",
	"Cardinal",
	"Carefree",
	"Caretaker",
	"Casual",
	"Cathartic",
	"Causal",
	"Chapel",
	"Characterized",
	"Charcoal",
	"Cheeky",
	"Cherished",
	"Chipotle",
	"Chirping",
	"Chivalrous",
	"Circumstantial",
	"Civic",
	"Civil",
	"Civilised",
	"Clanking",
	"Clapping",
	"Claptrap",
	"Classless",
	"Cleansed",
	"Cleric",
	"Cloistered",
	"Codified",
	"Colloquial",
	"Colour",
	"Combat",
	"Combined",
	"Comely",
	"Commissioned",
	"Commonplace",
	"Commuter",
	"Commuting",
	"Comparable",
	"Complementary",
	"Compromising",
	"Conceding",
	"Concentrated",
	"Conceptual",
	"Conditioned",
	"Confederate",
	"Confident",
	"Confidential",
	"Confining",
	"Confuse",
	"Congressional",
	"Consequential",
	"Conservative",
	"Constituent",
	"Contaminated",
	"Contemporaneous",
	"Contraceptive",
	"Convertible",
	"Convex",
	"Cooked",
	"Coronary",
	"Corporatist",
	"Correlated",
	"Corroborated",
	"Cosmic",
	"Cover",
	"Crash",
	"Crypto",
	"Culminate",
	"Cushioned",
	"Dandy",
	"Dashing",
	"Dazzled",
	"Decreased",
	"Decrepit",
	"Dedicated",
	"Defaced",
	"Defective",
	"Defenseless",
	"Deluded",
	"Deodorant",
	"Departed",
	"Depress",
	"Designing",
	"Despairing",
	"Destitute",
	"Detective",
	"Determined",
	"Devastating",
	"Deviant",
	"Devilish",
	"Devoted",
	"Diagonal",
	"Dictated",
	"Didactic",
	"Differentiated",
	"Diffused",
	"Dirtier",
	"Disabling",
	"Disconnected",
	"Discovered",
	"Disdainful",
	"Diseased",
	"Disfigured",
	"Disheartened",
	"Disheveled",
	"Disillusioned",
	"Disparate",
	"Dissident",
	"Doable",
	"Doctrinal",
	"Doing",
	"Dotted",
	"Double-blind",
	"Downbeat",
	"Dozen",
	"Draining",
	"Draught",
	"Dread",
	"Dried",
	"Dropped",
	"Dulled",
	"Duplicate",
	"Eaten",
	"Echoing",
	"Economical",
	"Elaborated",
	"Elastic",
	"Elective",
	"Electoral",
	"Elven",
	"Embryo",
	"Emerald",
	"Emergency",
	"Emissary",
	"Emotional",
	"Employed",
	"Enamel",
	"Encased",
	"Encrusted",
	"Endangered",
	"Engraved",
	"Engrossing",
	"Enlarged",
	"Enlisted",
	"Enlivened",
	"Ensconced",
	"Entangled",
	"Enthralling",
	"Entire",
	"Envious",
	"Eradicated",
	"Eroded",
	"Esoteric",
	"Essential",
	"Evaporated",
	"Ever-present",
	"Evergreen",
	"Everlasting",
	"Exacting",
	"Exasperated",
	"Excess",
	"Exciting",
	"Executable",
	"Existent",
	"Exonerated",
	"Exorbitant",
	"Exponential",
	"Export",
	"Extraordinary",
	"Exultant",
	"Exulting",
	"Facsimile",
	"Fading",
	"Fainter",
	"Faith-based",
	"Fallacious",
	"Faltering",
	"Famous",
	"Fancier",
	"Fast-growing",
	"Fated",
	"Favourable",
	"Fearless",
	"Feathered",
	"Fellow",
	"Fermented",
	"Ferocious",
	"Fiddling",
	"Filling",
	"Firmer",
	"Fitted",
	"Flammable",
	"Flawed",
	"Fledgling",
	"Fleshy",
	"Flexible",
	"Flickering",
	"Floral",
	"Flowering",
	"Flowing",
	"Foggy",
	"Folic",
	"Foolhardy",
	"Foolish",
	"Footy",
	"Forehand",
	"Forked",
	"Formative",
	"Formulaic",
	"Foul-mouthed",
	"Fractional",
	"Fragrant",
	"Fraudulent",
	"Freakish",
	"Freckled",
	"Freelance",
	"Freight",
	"Fresh",
	"Fretted",
	"Frugal",
	"Fulfilling",
	"Fuming",
	"Funded",
	"Funny",
	"Garbled",
	"Gathered",
	"Geologic",
	"Geometric",
	"Gibberish",
	"Gilded",
	"Ginger",
	"Glare",
	"Glaring",
	"Gleaming",
	"Glorified",
	"Glorious",
	"Goalless",
	"Gold-plated",
	"Goody",
	"Grammatical",
	"Grande",
	"Grateful",
	"Gratuitous",
	"Graven",
	"Greener",
	"Grinding",
	"Grizzly",
	"Groaning",
	"Grudging",
	"Guaranteed",
	"Gusty",
	"Half-breed",
	"Hand-held",
	"Handheld",
	"Hands-off",
	"Hard-pressed",
	"Harlot",
	"Healing",
	"Healthier",
	"Healthiest",
	"Heart",
	"Heart-shaped",
	"Heathen",
	"Hedonistic",
	"Heralded",
	"Herbal",
	"High-density",
	"High-performance",
	"High-res",
	"High-yield",
	"Hissy",
	"Hitless",
	"Holiness",
	"Homesick",
	"Honorable",
	"Hooded",
	"Hopeless",
	"Horrendous",
	"Horrible",
	"Hot-button",
	"Huddled",
	"Human",
	"Humbling",
	"Humid",
	"Humiliating",
	"Hypnotized",
	"Idealistic",
	"Idiosyncratic",
	"Ignited",
	"Illustrated",
	"Illustrative",
	"Imitated",
	"Immense",
	"Immersive",
	"Immigrant",
	"Immoral",
	"Impassive",
	"Impressionable",
	"Improbable",
	"Impulsive",
	"In-between",
	"In-flight",
	"Inattentive",
	"Inbound",
	"Inbounds",
	"Incalculable",
	"Incomprehensible",
	"Indefatigable",
	"Indigo",
	"Indiscriminate",
	"Indomitable",
	"Inert",
	"Inflate",
	"Inform",
	"Inheriting",
	"Injured",
	"Injurious",
	"Inking",
	"Inoffensive",
	"Insane",
	"Insensible",
	"Insidious",
	"Insincere",
	"Insistent",
	"Insolent",
	"Insufferable",
	"Intemperate",
	"Interdependent",
	"Interesting",
	"Interfering",
	"Intern",
	"Interpreted",
	"Intersecting",
	"Intolerable",
	"Intolerant",
	"Intuitive",
	"Irresolute",
	"Irritate",
	"Jealous",
	"Jerking",
	"Joining",
	"Joint",
	"Journalistic",
	"Joyful",
	"Keyed",
	"Knowing",
	"Lacklustre",
	"Laden",
	"Lagging",
	"Lamented",
	"Laughable",
	"Layered",
	"Leather",
	"Leathern",
	"Leery",
	"Left-footed",
	"Legible",
	"Leisure",
	"Lessening",
	"Liberating",
	"Life-size",
	"Lifted",
	"Lightest",
	"Limitless",
	"Listening",
	"Literary",
	"Liver",
	"Livid",
	"Lobster",
	"Locked",
	"Long-held",
	"Long-lasting",
	"Long-running",
	"Long-suffering",
	"Loudest",
	"Loveliest",
	"Low-budget",
	"Low-carb",
	"Lowering",
	"Lucid",
	"Luckless",
	"Lusty",
	"Luxurious",
	"Magazine",
	"Maniac",
	"Manmade",
	"Maroon",
	"Mastered",
	"Mated",
	"Material",
	"Materialistic",
	"Meaningful",
	"Measuring",
	"Mediaeval",
	"Medical",
	"Meditated",
	"Medley",
	"Melodic",
	"Memorable",
	"Memorial",
	"Metabolic",
	"Metallic",
	"Metallurgical",
	"Metering",
	"Midair",
	"Midterm",
	"Midway",
	"Mighty",
	"Migrating",
	"Mind-blowing",
	"Mind-boggling",
	"Minor",
	"Mirrored",
	"Misguided",
	"Misshapen",
	"Mitigated",
	"Mixed",
	"Modernized",
	"Molecular",
	"Monarch",
	"Monastic",
	"Morbid",
	"Motley",
	"Motorized",
	"Mounted",
	"Multi-million",
	"Multidisciplinary",
	"Muscled",
	"Muscular",
	"Muted",
	"Mysterious",
	"Mythic",
	"Nail-biting",
	"Natural",
	"Nauseous",
	"Negative",
	"Networked",
	"Neurological",
	"Neutered",
	"Newest",
	"Night",
	"Nitrous",
	"No-fly",
	"Noncommercial",
	"Nonsense",
	"North",
	"Nuanced",
	"Occurring",
	"Offensive",
	"Oldest",
	"Oncoming",
	"One-eyed",
	"One-year",
	"Onstage",
	"Onward",
	"Opaque",
	"Open-ended",
	"Operating",
	"Opportunist",
	"Opposing",
	"Opt-in",
	"Ordinate",
	"Outdone",
	"Outlaw",
	"Outsized",
	"Overboard",
	"Overheated",
	"Oversize",
	"Overworked",
	"Oyster",
	"Paced",
	"Panting",
	"Paralyzed",
	"Paramount",
	"Parental",
	"Parted",
	"Partisan",
	"Passive",
	"Pastel",
	"Patriot",
	"Peacekeeping",
	"Pedestrian",
	"Peevish",
	"Penal",
	"Penned",
	"Pensive",
	"Perceptual",
	"Perky",
	"Permissible",
	"Pernicious",
	"Perpetuate",
	"Perplexed",
	"Pervasive",
	"Petrochemical",
	"Philosophical",
	"Picturesque",
	"Pillaged",
	"Piped",
	"Piquant",
	"Pitching",
	"Plausible",
	"Pliable",
	"Plumb",
	"Politician",
	"Polygamous",
	"Poorest",
	"Portmanteau",
	"Posed",
	"Positive",
	"Possible",
	"Postpartum",
	"Prank",
	"Pre-emptive",
	"Precocious",
	"Predicted",
	"Premium",
	"Preparatory",
	"Prerequisite",
	"Prescient",
	"Preserved",
	"Presidential",
	"Pressed",
	"Pressurized",
	"Presumed",
	"Prewar",
	"Priced",
	"Pricier",
	"Primal",
	"Primer",
	"Primetime",
	"Printed",
	"Private",
	"Problem",
	"Procedural",
	"Process",
	"Prodigious",
	"Professional",
	"Programmed",
	"Progressive",
	"Prolific",
	"Promising",
	"Promulgated",
	"Pronged",
	"Proportionate",
	"Protracted",
	"Pulled",
	"Pulsed",
	"Purgatory",
	"Quick",
	"Rapid-fire",
	"Raunchy",
	"Razed",
	"Reactive",
	"Readable",
	"Realizing",
	"Recognised",
	"Recovering",
	"Recurrent",
	"Recycled",
	"Redeemable",
	"Reflecting",
	"Regal",
	"Registering",
	"Reliable",
	"Reminiscent",
	"Remorseless",
	"Removable",
	"Renewable",
	"Repeating",
	"Repellent",
	"Reserve",
	"Resigned",
	"Respectful",
	"Rested",
	"Restrict",
	"Resultant",
	"Retaliatory",
	"Retiring",
	"Revelatory",
	"Reverend",
	"Reversing",
	"Revolving",
	"Ridiculous",
	"Right-hand",
	"Ringed",
	"Risque",
	"Robust",
	"Roomful",
	"Rotating",
	"Roused",
	"Rubber",
	"Run-down",
	"Running",
	"Runtime",
	"Rustling",
	"Safest",
	"Salient",
	"Sanctioned",
	"Saute",
	"Saved",
	"Scandalized",
	"Scarlet",
	"Scattering",
	"Sceptical",
	"Scheming",
	"Scoundrel",
	"Scratched",
	"Scratchy",
	"Scrolled",
	"Seated",
	"Second-best",
	"Segregated",
	"Self-taught",
	"Semiautomatic",
	"Senior",
	"Sensed",
	"Sentient",
	"Sexier",
	"Shadowy",
	"Shaken",
	"Shaker",
	"Shameless",
	"Shaped",
	"Shiny",
	"Shipped",
	"Shivering",
	"Shoestring",
	"Short",
	"Short-lived",
	"Signed",
	"Simplest",
	"Simplistic",
	"Sizable",
	"Skeleton",
	"Skinny",
	"Skirting",
	"Skyrocketed",
	"Slamming",
	"Slanting",
	"Slapstick",
	"Sleek",
	"Sleepless",
	"Sleepy",
	"Slender",
	"Slimmer",
	"Smacking",
	"Smokeless",
	"Smothered",
	"Smouldering",
	"Snuff",
	"Socialized",
	"Solid-state",
	"Sometime",
	"Sought",
	"Spanking",
	"Sparing",
	"Spattered",
	"Specialized",
	"Specific",
	"Speedy",
	"Spherical",
	"Spiky",
	"Spineless",
	"Sprung",
	"Squint",
	"Stainless",
	"Standing",
	"Starlight",
	"Startled",
	"Stately",
	"Statewide",
	"Stereoscopic",
	"Sticky",
	"Stimulant",
	"Stinky",
	"Stoked",
	"Stolen",
	"Storied",
	"Strained",
	"Strapping",
	"Strengthened",
	"Stubborn",
	"Stylized",
	"Suave",
	"Subjective",
	"Subjugated",
	"Subordinate",
	"Succeeding",
	"Suffering",
	"Summary",
	"Sunset",
	"Sunshine",
	"Supernatural",
	"Supervisory",
	"Supply-side",
	"Surrogate",
	"Suspended",
	"Suspenseful",
	"Swarthy",
	"Sweating",
	"Sweeping",
	"Swinging",
	"Swooning",
	"Sympathize",
	"Synchronized",
	"Synonymous",
	"Synthetic",
	"Tailed",
	"Tallest",
	"Tangible",
	"Tanked",
	"Tarry",
	"Technical",
	"Tectonic",
	"Telepathic",
	"Tenderest",
	"Territorial",
	"Testimonial",
	"Theistic",
	"Thicker",
	"Threatening",
	"Tight-lipped",
	"Timed",
	"Timely",
	"Timid",
	"Torrent",
	"Totalled",
	"Tougher",
	"Traditional",
	"Transformed",
	"Trapped",
	"Traveled",
	"Traverse",
	"Treated",
	"Trial",
	"Trunk",
	"Trusting",
	"Trying",
	"Twisted",
	"Two-lane",
	"Tyrannical",
	"Unaided",
	"Unassisted",
	"Unassuming",
	"Unattractive",
	"Uncapped",
	"Uncomfortable",
	"Uncontrolled",
	"Uncooked",
	"Uncooperative",
	"Underground",
	"Undersea",
	"Undisturbed",
	"Unearthly",
	"Uneasy",
	"Unequal",
	"Unfazed",
	"Unfinished",
	"Unforeseen",
	"Unforgivable",
	"Unidentified",
	"Unimaginative",
	"Uninspired",
	"Unintended",
	"Uninvited",
	"Universal",
	"Unmasked",
	"Unorthodox",
	"Unparalleled",
	"Unpleasant",
	"Unprincipled",
	"Unread",
	"Unreasonable",
	"Unregulated",
	"Unreliable",
	"Unremitting",
	"Unsafe",
	"Unsanitary",
	"Unsealed",
	"Unsuccessful",
	"Unsupervised",
	"Untimely",
	"Unwary",
	"Unwrapped",
	"Uppity",
	"Upstart",
	"Useless",
	"Utter",
	"Valiant",
	"Valid",
	"Valued",
	"Vanilla",
	"Vaulting",
	"Vaunted",
	"Veering",
	"Vegetative",
	"Vented",
	"Verbal",
	"Verifying",
	"Veritable",
	"Versed",
	"Vinyl",
	"Virgin",
	"Visceral",
	"Visual",
	"Voluptuous",
	"Walk-on",
	"Wanton",
	"Warlike",
	"Washed",
	"Waterproof",
	"Waved",
	"Weakest",
	"Well-bred",
	"Well-chosen",
	"Well-informed",
	"Wetting",
	"Wheeled",
	"Whirlwind",
	"Widen",
	"Widening",
	"Willful",
	"Willing",
	"Winnable",
	"Winningest",
	"Wireless",
	"Wistful",
	"Woeful",
	"Wooded",
	"Woodland",
	"Wordless",
	"Workable",
	"Worldly",
	"Worldwide",
	"Worst-case",
	"Worsted",
	"Worthless"
];

const animals = [
	"Aardvark",
	"Albatross",
	"Alligator",
	"Alpaca",
	"Ant",
	"Anteater",
	"Antelope",
	"Ape",
	"Armadillo",
	"Donkey",
	"Baboon",
	"Badger",
	"Barracuda",
	"Bat",
	"Bear",
	"Beaver",
	"Bee",
	"Bison",
	"Boar",
	"Buffalo",
	"Butterfly",
	"Camel",
	"Capybara",
	"Caribou",
	"Cassowary",
	"Cat",
	"Caterpillar",
	"Cattle",
	"Chamois",
	"Cheetah",
	"Chicken",
	"Chimpanzee",
	"Chinchilla",
	"Chough",
	"Clam",
	"Cobra",
	"Cockroach",
	"Cod",
	"Cormorant",
	"Coyote",
	"Crab",
	"Crane",
	"Crocodile",
	"Crow",
	"Curlew",
	"Deer",
	"Dinosaur",
	"Dog",
	"Dogfish",
	"Dolphin",
	"Dotterel",
	"Dove",
	"Dragonfly",
	"Duck",
	"Dugong",
	"Dunlin",
	"Eagle",
	"Echidna",
	"Eel",
	"Eland",
	"Elephant",
	"Elk",
	"Emu",
	"Falcon",
	"Ferret",
	"Finch",
	"Fish",
	"Flamingo",
	"Fly",
	"Fox",
	"Frog",
	"Gaur",
	"Gazelle",
	"Gerbil",
	"Giraffe",
	"Gnat",
	"Gnu",
	"Goat",
	"Goldfinch",
	"Goldfish",
	"Goose",
	"Gorilla",
	"Goshawk",
	"Grasshopper",
	"Grouse",
	"Guanaco",
	"Gull",
	"Hamster",
	"Hare",
	"Hawk",
	"Hedgehog",
	"Heron",
	"Herring",
	"Hippopotamus",
	"Horse",
	"Human",
	"Hummingbird",
	"Hyena",
	"Ibex",
	"Ibis",
	"Jackal",
	"Jaguar",
	"Jay",
	"Jellyfish",
	"Kangaroo",
	"Kingfisher",
	"Koala",
	"Kookabura",
	"Kouprey",
	"Kudu",
	"Lapwing",
	"Lark",
	"Lemur",
	"Leopard",
	"Lion",
	"Llama",
	"Lobster",
	"Locust",
	"Loris",
	"Louse",
	"Lyrebird",
	"Magpie",
	"Mallard",
	"Manatee",
	"Mandrill",
	"Mantis",
	"Marten",
	"Meerkat",
	"Mink",
	"Mole",
	"Mongoose",
	"Monkey",
	"Moose",
	"Mosquito",
	"Mouse",
	"Mule",
	"Narwhal",
	"Newt",
	"Nightingale",
	"Octopus",
	"Okapi",
	"Opossum",
	"Oryx",
	"Ostrich",
	"Otter",
	"Owl",
	"Oyster",
	"Panther",
	"Parrot",
	"Partridge",
	"Peafowl",
	"Pelican",
	"Penguin",
	"Pheasant",
	"Pig",
	"Pigeon",
	"Pony",
	"Porcupine",
	"Porpoise",
	"Quail",
	"Quelea",
	"Quetzal",
	"Rabbit",
	"Raccoon",
	"Rail",
	"Ram",
	"Rat",
	"Raven",
	"Red deer",
	"Red panda",
	"Reindeer",
	"Rhinoceros",
	"Rook",
	"Salamander",
	"Salmon",
	"Sand Dollar",
	"Sandpiper",
	"Sardine",
	"Scorpion",
	"Seahorse",
	"Seal",
	"Shark",
	"Sheep",
	"Shrew",
	"Skunk",
	"Snail",
	"Snake",
	"Sparrow",
	"Spider",
	"Spoonbill",
	"Squid",
	"Squirrel",
	"Starling",
	"Stingray",
	"Stinkbug",
	"Stork",
	"Swallow",
	"Swan",
	"Tapir",
	"Tarsier",
	"Termite",
	"Tiger",
	"Toad",
	"Trout",
	"Turkey",
	"Turtle",
	"Viper",
	"Vulture",
	"Wallaby",
	"Walrus",
	"Wasp",
	"Weasel",
	"Whale",
	"Wildcat",
	"Wolf",
	"Wolverine",
	"Wombat",
	"Woodcock",
	"Woodpecker",
	"Worm",
	"Wren",
	"Yak",
	"Zebra"
];
