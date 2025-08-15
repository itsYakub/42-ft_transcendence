import { DatabaseSync } from "node:sqlite";
import { accessToken, hashPassword, refreshToken, validJWT } from "../../auth/jwt.js";
import { compareSync } from "bcrypt-ts";
import { readFileSync } from "fs";
import { join } from "path";

const __dirname = import.meta.dirname;

/*
	Sets up the Users table
*/
export function initUsers(db: DatabaseSync, dropUsers: boolean): void {
	if (dropUsers)
		db.exec(`DROP TABLE IF EXISTS Users;`);

	db.exec(`
		CREATE TABLE IF NOT EXISTS Users (
		UserID INTEGER PRIMARY KEY AUTOINCREMENT,
		Nick TEXT UNIQUE NOT NULL,
		Email TEXT,
		RoomID TEXT,
		Ready INTEGER NOT NULL DEFAULT 0,
		TOTPVerified INTEGER NOT NULL DEFAULT 0,
		Online INTEGER NOT NULL DEFAULT 1,
		Avatar TEXT,
		Password TEXT,
		RefreshToken TEXT UNIQUE,
		TOTPSecret TEXT,
		Type TEXT DEFAULT user
		);`);
}

/*
	Gets a user using the refresh token if it's still valid
*/
function getUserByRefreshToken(db: DatabaseSync, refreshToken: string): any {
	const valid = validJWT(refreshToken);
	if (valid) {
		let payload = refreshToken.split(".")[1];
		payload = atob(payload);
		const { exp } = JSON.parse(payload);
		const date = new Date(exp);
		if (date < new Date()) {
			return {
				code: 404,
				error: "ERR_EXPIRED_TOKEN"
			}
		}
		const select = db.prepare("SELECT * FROM Users WHERE RefreshToken = ?");
		const user = select.get(refreshToken);
		if (!user) {
			return {
				code: 404,
				error: "ERR_NO_USER"
			}
		}
		return {
			code: 200,
			user: {
				id: user.UserID,
				nick: user.Nick,
				email: user.Email,
				avatar: user.Avatar,
				password: user.Password,
				refreshToken: user.RefreshToken,
				online: user.Online,
				totpSecret: user.TOTPSecret,
				totpVerified: user.TOTPVerified,
				totpEmail: user.TOTPEmail,
				type: user.Type,
				roomID: user.RoomID
			}
		};
	}
	return {
		code: 404,
		error: "ERR_NO_USER"
	}
}

/*
	Returns a complete user from the DB
*/
export function getUser(db: DatabaseSync, accessToken: string, refreshToken: string): any {
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

			const select = db.prepare("SELECT * FROM Users WHERE UserID = ?");
			const user = select.get(sub);
			if (!user) {
				return {
					code: 404,
					error: "ERR_NO_USER"
				}
			}
			return {
				code: 200,
				user: {
					id: user.UserID,
					nick: user.Nick,
					email: user.Email,
					avatar: user.Avatar,
					password: user.Password,
					refreshToken: user.RefreshToken,
					online: user.Online,
					totpSecret: user.TOTPSecret,
					totpVerified: user.TOTPVerified,
					totpEmail: user.TOTPEmail,
					type: user.Type,
					roomID: user.RoomID
				}
			};
		}
		else
			return getUserByRefreshToken(db, refreshToken);
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		}
	}
}

/*
	Adds a user to the DB after a sign up with email/password
*/
export function addUser(db: DatabaseSync, { email, password }): any {
	try {
		const response = getNickname(db);
		if (200 != response.code)
			return response;

		const avatar = "data:image/jpeg;base64," + readFileSync(join(__dirname, '../../default.jpg'), { encoding: 'base64' });

		const pw = hashPassword(password);
		const insert = db.prepare('INSERT INTO Users (Nick, Email, Password, Avatar) VALUES (?, ?, ?, ?)');
		const statementSync = insert.run(response.nickname, email, pw, avatar);
		const id: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(id);
		updateRefreshtoken(db, {
			id, refreshToken: token
		});
		return {
			code: 200,
			accessToken: accessToken(id),
			refreshToken: token
		};
	}
	catch (e) {
		if ("constraint failed" == e.errstr) {
			return {
				code: 401,
				error: "ERR_EMAIL_IN_USE"
			}
		}
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Adds a guest to the DB
*/
export function addGuest(db: DatabaseSync): any {
	try {
		const response = getNickname(db);
		if (200 != response.code)
			return response;

		const insert = db.prepare('INSERT INTO Users (Nick, Type) VALUES (?, ?)');
		const statementSync = insert.run(response.nickname, "guest");
		const id: number = statementSync.lastInsertRowid as number;
		return {
			code: 200,
			accessToken: refreshToken(id)
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	After a successful Google Sign-in/up, gets the user from the DB or adds it
*/
export function addGoogleUser(db: DatabaseSync, { email, avatar }): any {
	try {
		let response = getUserByEmail(db, email);
		if (200 == response.code) {
			const token = refreshToken(response.user.id);
			updateRefreshtoken(db, {
				id: response.user.id,
				refreshToken: token
			});
			return {
				accessToken: accessToken(response.user.id),
				refreshToken: token
			};
		}

		response = getNickname(db);
		if (200 != response.code)
			return response;

		const insert = db.prepare('INSERT INTO Users (Nick, Email, Avatar, Type) VALUES (?, ?, ?, ?)');
		const statementSync = insert.run(response.nickname, email, avatar, "google");
		const id: number = statementSync.lastInsertRowid as number;
		const token = refreshToken(id);
		updateRefreshtoken(db, {
			id,
			refreshToken: token
		});
		return {
			code: 200,
			accessToken: accessToken(id),
			refreshToken: token
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Gets a user from the DB after an email/password login
*/
export function loginUser(db: DatabaseSync, { email, password }) {
	try {
		const userResponse = getUserByEmail(db, email);
		if (200 != userResponse.code)
			return userResponse;

		if (compareSync(password, userResponse.user.password)) {
			const token = refreshToken(userResponse.user.id);
			updateRefreshtoken(db, {
				id: userResponse.user.id, refreshToken: token
			});
			return {
				code: 200,
				user: {
					nick: userResponse.user.nick,
					email: userResponse.user.email,
					avatar: userResponse.user.avatar,
					totpEnabled: userResponse.user.totpEnabled,
					totpSecret: userResponse.user.totpSecret
				},
				accessToken: accessToken(userResponse.user.id),
				refreshToken: token
			}
		}
		return {
			code: 401,
			error: "ERR_NO_USER"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Gets a user from the DB after an email/password login
*/
export function loginUserWithTOTP(db: DatabaseSync, { email, password, code }) {
	try {
		const user = getUserByEmail(db, email);
		if (user.error) {
			return user;
		}

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
			const token = refreshToken(user.id);
			updateRefreshtoken(db, {
				id: user.id, refreshToken: token
			});
			return {
				code: 200,
				user: {
					nick: user.nick,
					avatar: user.avatar,
					accessToken: accessToken(user.id),
					refreshToken: token
				}
			}
		}
		return {
			code: 401,
			error: "ERR_NO_USER"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

// Finds the user in the DB by email
export function getUserByEmail(db: DatabaseSync, email: string): any {
	try {
		const select = db.prepare("SELECT * FROM Users WHERE Email = ?");
		const user = select.get(email);
		if (user) {
			return {
				code: 200,
				user: {
					id: user.UserID,
					nick: user.Nick,
					email: user.Email,
					avatar: user.Avatar,
					password: user.Password,
					totpEnabled: user.TOTPVerified,
					totpSecret: user.TOTPSecret
				}
			}
		}
		return {
			code: 404,
			error: "ERR_NO_USER"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function updateRefreshtoken(db: DatabaseSync, { id, refreshToken }) {
	try {
		const select = db.prepare("UPDATE Users SET RefreshToken = ? WHERE UserID = ?");
		select.run(refreshToken, id);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function invalidateToken(db: DatabaseSync, { id }) {
	try {
		const select = db.prepare("UPDATE Users SET RefreshToken = NULL WHERE UserID = ?");
		select.run(id);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function markUserOnline(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("UPDATE Users SET Online = 1 WHERE UserID = ?");
		select.run(id);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

export function markUserOffline(db: DatabaseSync, user: any) {
	try {
		const select = db.prepare("UPDATE Users SET Online = 0 WHERE UserID = ?");
		select.run(user.id);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}



export function markUserOffline2(db: DatabaseSync, user: any) {
	try {
		let select = db.prepare("UPDATE Rooms SET Players = Players - 1 WHERE RoomID = ?");
		select.run(user.roomID);
		console.log(`User ${user.nick} left ${user.roomID}`);
		select = db.prepare("UPDATE Users SET RoomID = NULL WHERE UserID = ?");
		select.run(user.id);
		return {
			code: 200,
			message: "SUCCESS"
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Returns a list of all nicknames currently in the DB
*/
export function allNicknames(db: DatabaseSync) {
	try {
		const select = db.prepare("SELECT Nick FROM Users");
		const result = select.all();
		let nicknames = [];
		result.forEach((user) => {
			nicknames.push(user.Nick);
		});

		return {
			code: 200,
			nicknames
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Returns a list of all nicknames currently in the DB
*/
export function allUsers(db: DatabaseSync) {
	try {
		const select = db.prepare("SELECT UserID, Nick FROM Users");
		const result = select.all();
		let users = [];
		result.forEach((user) => {
			users.push({
				id: user.UserID,
				nick: user.Nick
			});
		});

		return {
			code: 200,
			users
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

/*
	Returns a list of all nicknames currently in the DB
*/
export function allOtherUsers(db: DatabaseSync, id: number) {
	try {
		const select = db.prepare("SELECT UserID, Nick FROM Users WHERE ? != UserID");
		const result = select.all(id);
		let users = [];
		result.forEach((user) => {
			users.push({
				id: user.UserID,
				nick: user.Nick
			});
		});

		return {
			code: 200,
			users
		};
	}
	catch (e) {
		return {
			code: 500,
			error: "ERR_DB"
		};
	}
}

function getNickname(db: DatabaseSync): any {
	const response = allNicknames(db);
	if (response.error) {
		return response;
	}

	let nickname = generateNickname();
	while (response.nicknames.includes(nickname))
		nickname = generateNickname();

	return {
		code: 200,
		nickname
	};
}

function generateNickname(): string {
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const animal = animals[Math.floor(Math.random() * animals.length)];

	return `${adjective} ${animal}`;
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
	"Hornet",
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
