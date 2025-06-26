import x from 'sqlite3'

const sqlite3 = x.verbose();

const db = new sqlite3.Database('transcendence.db');

createDB();

const createDB = function() {
	const createString = `CREATE TABLE users (ID INTEGER PRIMARY KEY, NAME TEXT, NUM TEXT)`;
	db.run(createString, (err) => {
		if (err) {
			console.error('Error creating db');
		} else {
			console.log('Created db successfully.');
			insertData();
		}
	});
}

const insertData = function() {
	const insertString = `INSERT INTO users (NAME, NUM) VALUES ('GeeksforGeeks', 'test')`;
	db.run(insertString, (err) => {
		if (err) {
			console.error('Error inserting data');
		} else {
			console.log('Inserted data successfully.');
		}
	});
}
