const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);
db.all('SELECT * FROM users', [], (err, rows) => {
  if (err) {
    console.error('Error reading users:', err);
  } else {
    console.log('Users in database:');
    rows.forEach(row => {
      console.log(`- ${row.username} (${row.role}): ${row.full_name}`);
    });
  }
  db.close();
});