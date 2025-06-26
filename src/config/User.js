export class User {
  constructor(conn) {
    this.conn = conn;
  }

  create({ nick, email }) {
    const stmt = this.conn.prepare(
      `INSERT INTO users (nick, email) 
       VALUES (?, ?)`
    );
    const { lastInsertRowid } = stmt.run(nick, email);
    return { id: lastInsertRowid, nick, email };
  }
}
