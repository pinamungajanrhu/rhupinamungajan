const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

db.run(`ALTER TABLE users ADD COLUMN barangay TEXT`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('barangay column already exists in users table');
    } else {
      console.error('Error adding barangay column:', err);
    }
  } else {
    console.log('barangay column added successfully to users table');
  }
  
  db.run(
    'UPDATE users SET barangay = ? WHERE username = ?',
    ['Poblacion', 'barangay01'],
    (err) => {
      if (err) {
        console.error('Error updating barangay01:', err);
      } else {
        console.log('Updated barangay01 with barangay Poblacion');
      }
      db.close();
    }
  );
});