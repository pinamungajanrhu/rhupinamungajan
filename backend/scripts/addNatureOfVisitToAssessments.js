const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

db.run(`ALTER TABLE assessments ADD COLUMN nature_of_visit TEXT DEFAULT 'New Registration'`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('nature_of_visit column already exists in assessments table');
    } else {
      console.error('Error adding nature_of_visit column:', err);
    }
  } else {
    console.log('nature_of_visit column added successfully to assessments table');
  }
  db.close();
});