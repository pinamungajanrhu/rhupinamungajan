const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

// Add created_by column to residents table
db.run(`ALTER TABLE residents ADD COLUMN created_by INTEGER`, (err) => {
  if (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('created_by column already exists');
    } else {
      console.error('Error adding created_by column:', err);
    }
  } else {
    console.log('created_by column added successfully');
  }
  
  // Update sample data to have created_by values
  const updates = [
    { id: 1, created_by: 1 }, // Juan - created by barangay01
    { id: 2, created_by: 1 }, // Maria - created by barangay01
    { id: 3, created_by: 1 }, // Pedro - created by barangay01
    { id: 4, created_by: 1 }, // Ana - created by barangay01
    { id: 5, created_by: 1 }, // Carlos - created by barangay01
  ];

  let completed = 0;
  updates.forEach((update) => {
    db.run(
      'UPDATE residents SET created_by = ? WHERE id = ?',
      [update.created_by, update.id],
      (err) => {
        if (err) {
          console.error(`Error updating resident ${update.id}:`, err);
        } else {
          console.log(`Updated resident ${update.id} with created_by ${update.created_by}`);
        }
        
        completed++;
        if (completed === updates.length) {
          console.log('All sample data updated with created_by values');
          db.close();
        }
      }
    );
  });
});
