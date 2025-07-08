export class AdminController {
    constructor(db) {
        this.db = db;
        this.setup();
    }
    setup() {
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
    addUser(nick, email, isAdmin) {
        const insert = this.db.prepare('INSERT INTO Users (Nick, Email, IsAdmin) VALUES (?, ?, ?)');
        insert.run(nick, email, isAdmin);
    }
}
