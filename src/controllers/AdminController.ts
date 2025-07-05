import { DatabaseSync } from 'node:sqlite';

export class AdminController {
	constructor(private db: DatabaseSync) {
		this.setup();
	}

	setup(): void {
		this.db.exec(`DROP TABLE IF EXISTS Users;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      Nick TEXT UNIQUE NOT NULL,
      Email TEXT UNIQUE NOT NULL,
	  IsAdmin INTEGER NOT NULL
    );
  `);
		this.addUser("coldandtired", "coldandtired@gmail.com", 1);
		console.log("Set up user db");
	}

	addUser(nick: string, email: string, isAdmin: number) {
		const insert = this.db.prepare('INSERT INTO Users (Nick, Email, IsAdmin) VALUES (?, ?, ?)');
		insert.run(nick, email, isAdmin);
	}
}

// // Shows the user details page
// export function getUser(request, reply) {
//   const { id } = request.params;
//   const { db } = request.server;
//   const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

//   if (!user) {
// 	return reply.status(404).send({ error: "User not found" });
//   }

//   return reply.view("user", { title: user.nick, user });
// }

// // Shows the add new user page
// export function getNewUser(request, reply) {
//   return reply.view("new_user", { title: "New user" });
// }

// // Define the schema for registering
// // Change to frontend checking?
// const registerSchema = {
//   type: "object",
//   properties: {
// 	nick: {
// 	  type: "string",
// 	  minLength: 1,
// 	  maxLength: 3,
// 	  pattern: "^(?=.*[a-zA-Z]).+$",
// 	},
// 	email: { type: "string", minLength: 1 },
//   },
//   required: ["nick", "email"],
//   additionalProperties: false,
// };

// const validateRegister = ajv.compile(registerSchema);

// // Adds a user to the db
// export function postNewUser(request, reply) {
// 	// grab all other names, check for uniqueness
// 	const { nick, email } = request.body;

// 	const valid = validateRegister({ nick, email });
// 	if (!valid) {
// 		return reply.status(400).send({
// 			error: "Invalid input",
// 			details: validateRegister.errors,
// 		});
// 	}

// 	  const { db } = request.server;

//   const insertStatement = db.prepare(
// 	"INSERT INTO users (nick, email) VALUES (?, ?)"
//   );
//   insertStatement.run(nick, email);

//   return reply.redirect("/");
// }

// // Shows the edit user page
// export function getEditUser(request, reply) {
//   const { id } = request.params;
//   const { db } = request.server;
//   const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

//   if (!user) {
// 	return reply.status(404).send({ error: "User not found" });
//   }

//   return reply.view("edit", { title: "Edit user", user });
// }

// // Edits the user in the db
// export function postEditUser(request, reply) {
//   const { id } = request.params;
//   const { nick, email } = request.body;
//   const { db } = request.server;

//   const updateStatement = db.prepare(
// 	"UPDATE users SET nick = ?, email = ? WHERE id = ?"
//   );

//   updateStatement.run(nick, email, id);

//   return reply.redirect(`/user/${id}`);
// }

// // Deletes a user from the db
// export function deleteUser(request, reply) {
//   const { id } = request.params;
//   const { db } = request.server;

//   const deleteStatement = db.prepare("DELETE FROM users WHERE id = ?");
//   deleteStatement.run(id);

//   return reply.redirect("/");
// }
