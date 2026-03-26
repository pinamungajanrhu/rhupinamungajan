const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');

// Create database directory if it doesn't exist
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Initialize database tables
async function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('barangay', 'rhu', 'doctor')),
          full_name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Residents table
      db.run(`
        CREATE TABLE IF NOT EXISTS residents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          middle_name TEXT,
          last_name TEXT NOT NULL,
          suffix TEXT,
          birthdate DATE NOT NULL,
          birthplace TEXT,
          sex TEXT CHECK (sex IN ('Male', 'Female')),
          civil_status TEXT,
          educational_attainment TEXT,
          employment_status TEXT,
          monthly_income TEXT,
          occupation TEXT,
          religion TEXT,
          indigenous TEXT,
          blood_type TEXT,
          mother_first_name TEXT,
          mother_last_name TEXT,
          mother_middle_name TEXT,
          mother_birthdate DATE,
          country TEXT,
          number_street TEXT,
          region TEXT,
          province TEXT,
          city_municipality TEXT,
          barangay TEXT NOT NULL,
          zip_code TEXT,
          email TEXT,
          mobile TEXT,
          landline TEXT,
          family_member TEXT,
          dswd_nhts_member BOOLEAN,
          facility_household_number TEXT,
          family_serial_number TEXT,
          philhealth_member TEXT CHECK (philhealth_member IN ('Member', 'Dependent') OR philhealth_member IS NULL),
          philhealth_number TEXT,
          philhealth_category TEXT,
          pcb_eligible TEXT CHECK (pcb_eligible IN ('Less than 24H', 'More than 24H')),
          status TEXT DEFAULT 'Pending RHU Validation' CHECK (status IN ('Pending RHU Validation', 'Ready for Doctor Consultation', 'Completed')),
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Assessments table (PCHRAT)
      db.run(`
        CREATE TABLE IF NOT EXISTS assessments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          resident_id INTEGER NOT NULL,
          consultation_date DATE NOT NULL,
          assessed_by TEXT NOT NULL,
          type_of_exposure TEXT,
          bite_event_description TEXT,
          date_of_exposure DATE,
          comorbidities TEXT,
          personal_history TEXT,
          menstrual_history TEXT,
          pregnancy_history TEXT,
          family_history TEXT,
          smoking_history TEXT,
          social_history TEXT,
          alcohol_intake TEXT,
          dietary_fiber TEXT,
          high_fat_salt_food TEXT,
          physical_activity TEXT,
          angina_questionnaire TEXT,
          symptom_checklist TEXT,
          diabetes_presence TEXT,
          diabetes_symptoms TEXT,
          blood_glucose TEXT,
          blood_lipids TEXT,
          urine_protein TEXT,
          urine_ketones TEXT,
          management TEXT,
          lifestyle_modification TEXT,
          medications TEXT,
          follow_up_date DATE,
          laboratory_request TEXT,
          imaging TEXT,
          diagnosis TEXT,
          treatment_plan TEXT,
          prescription TEXT,
          remarks TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (resident_id) REFERENCES residents (id)
        )
      `);

      // Consultations table
      db.run(`
        CREATE TABLE IF NOT EXISTS consultations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          resident_id INTEGER NOT NULL,
          doctor_id INTEGER NOT NULL,
          diagnosis TEXT NOT NULL,
          findings TEXT NOT NULL,
          health_condition TEXT CHECK (health_condition IN ('Healthy', 'At Risk', 'Sick')),
          illness_type TEXT CHECK (illness_type IN ('Viral', 'Bacterial', 'Chronic', 'Other')),
          prescription TEXT,
          follow_up_date DATE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (resident_id) REFERENCES residents (id),
          FOREIGN KEY (doctor_id) REFERENCES users (id)
        )
      `);

      // YAKAP IDs table
      db.run(`
        CREATE TABLE IF NOT EXISTS yakap_ids (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          resident_id INTEGER UNIQUE NOT NULL,
          yakap_id TEXT UNIQUE NOT NULL,
          qr_code_data TEXT NOT NULL,
          generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (resident_id) REFERENCES residents (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('Database tables created successfully');
          insertMockUsers().then(resolve).catch(reject);
        }
      });
    });
  });
}

// Insert mock users for testing
async function insertMockUsers() {
  return new Promise((resolve, reject) => {
    const mockUsers = [
      {
        username: 'barangay01',
        password: 'password123',
        role: 'barangay',
        full_name: 'Juan Dela Cruz'
      },
      {
        username: 'rhu01',
        password: 'password123',
        role: 'rhu',
        full_name: 'Maria Santos'
      },
      {
        username: 'doctor01',
        password: 'password123',
        role: 'doctor',
        full_name: 'Dr. Jose Reyes'
      }
    ];

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (username, password, role, full_name)
      VALUES (?, ?, ?, ?)
    `);

    let completed = 0;
    mockUsers.forEach(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      insertUser.run([user.username, hashedPassword, user.role, user.full_name], (err) => {
        if (err) {
          console.error('Error inserting user:', err);
        } else {
          console.log(`User ${user.username} inserted successfully`);
        }
        completed++;
        if (completed === mockUsers.length) {
          insertUser.finalize();
          console.log('Mock users created successfully');
          console.log('Database initialization complete!');
          resolve();
        }
      });
    });
  });
}

// Run initialization
initDatabase().then(() => {
  db.close();
}).catch((err) => {
  console.error('Database initialization failed:', err);
  db.close();
});
