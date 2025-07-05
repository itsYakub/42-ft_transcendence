import { DatabaseSync } from 'node:sqlite';

export class GameController {
	constructor(private db: DatabaseSync) {
		this.setup();
	}

	setup(): void {
		this.db.exec(`DROP TABLE IF EXISTS Matches;`);

		this.db.exec(`
    CREATE TABLE IF NOT EXISTS Matches (
      MatchID INTEGER PRIMARY KEY AUTOINCREMENT,
      P1ID INTEGER NOT NULL,
	  P2ID INTEGER NOT NULL,
      P1Score INTEGER NOT NULL,
	  P2Score INTEGER NOT NULL,
      PlayedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
		console.log("Set up game db");
	}
}
