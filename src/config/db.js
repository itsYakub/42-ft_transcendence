import Database from "better-sqlite3";

export class DB {
	constructor() {
		const dbFile = "./transcendence.db";
		this.conn = new Database(dbFile, { verbose: console.log });
		this.#init();
	}

	#init() {
		this.conn.exec(`
		DROP TABLE users;
		`);

		this.conn.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nick TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `);

		this.conn.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      p1_id INTEGER NOT NULL,
	  p2_id INTEGER NOT NULL,
      p1_score INTEGER NOT NULL,
	  p2_score INTEGER NOT NULL,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
	}

	close() {
		if (this.conn) this.conn.close();
	}
}
