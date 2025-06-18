import fp from "fastify-plugin";
import Database from "better-sqlite3";

async function dbConnector(fastify, options) {
  const dbFile = "./transcendence.db";
  const db = new Database(dbFile, { verbose: console.log });

	// db.exec(`
	// 	DROP TABLE users;
	// 	`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nick TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      p1_id INTEGER NOT NULL,
	  p2_id INTEGER NOT NULL,
      p1_score INTEGER NOT NULL,
	  p2_score INTEGER NOT NULL,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Allows db to be accessed from other files
  fastify.decorate("db", db);

  fastify.addHook("onClose", (fastify, done) => {
    db.close();
    done();
  });

  console.log("Database and posts table created successfully");
}

export default fp(dbConnector);
