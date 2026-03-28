const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`ALTER TABLE assessments ADD COLUMN type_of_consultation TEXT`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('type_of_consultation column already exists in assessments table');
      } else {
        console.error('Error adding type_of_consultation column:', err);
      }
    } else {
      console.log('type_of_consultation column added successfully to assessments table');
    }
  });
});
db.close();