const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

async function addSampleData() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Add sample residents
      const residents = [
        {
          first_name: 'Juan',
          last_name: 'Dela Cruz',
          birthdate: '1990-05-15',
          sex: 'Male',
          barangay: 'Poblacion',
          city_municipality: 'Pinamungahan',
          province: 'Cebu',
          mobile: '09123456789',
          philhealth_number: '12-345678901-2',
          status: 'Completed',
          created_by: 1
        },
        {
          first_name: 'Maria',
          last_name: 'Santos',
          birthdate: '1985-08-22',
          sex: 'Female',
          barangay: 'Poblacion',
          city_municipality: 'Pinamungahan',
          province: 'Cebu',
          mobile: '09234567890',
          philhealth_number: '',
          status: 'Ready for Doctor Consultation',
          created_by: 1
        },
        {
          first_name: 'Pedro',
          last_name: 'Reyes',
          birthdate: '1992-12-10',
          sex: 'Male',
          barangay: 'Tubod',
          city_municipality: 'Pinamungahan',
          province: 'Cebu',
          mobile: '09345678901',
          philhealth_number: '12-345678902-3',
          status: 'Pending RHU Validation',
          created_by: 1
        },
        {
          first_name: 'Ana',
          last_name: 'Garcia',
          birthdate: '1988-03-25',
          sex: 'Female',
          barangay: 'Tubod',
          city_municipality: 'Pinamungahan',
          province: 'Cebu',
          mobile: '09456789012',
          philhealth_number: '12-345678903-4',
          status: 'Completed',
          created_by: 1
        },
        {
          first_name: 'Carlos',
          last_name: 'Mendoza',
          birthdate: '1995-07-18',
          sex: 'Male',
          barangay: 'Bulwang',
          city_municipality: 'Pinamungahan',
          province: 'Cebu',
          mobile: '09567890123',
          philhealth_number: '',
          status: 'Ready for Doctor Consultation',
          created_by: 1
        }
      ];

      let completedResidents = 0;
      
      residents.forEach((resident, index) => {
        const columns = Object.keys(resident).join(', ');
        const placeholders = Object.keys(resident).map(() => '?').join(', ');
        const values = Object.values(resident);

        db.run(
          `INSERT OR IGNORE INTO residents (${columns}) VALUES (${placeholders})`,
          values,
          function(err) {
            if (err) {
              console.error('Error inserting resident:', err);
            } else {
              console.log(`Resident ${resident.first_name} ${resident.last_name} added`);
            }
            
            completedResidents++;
            if (completedResidents === residents.length) {
              // Add sample consultations
              addSampleConsultations().then(resolve).catch(reject);
            }
          }
        );
      });
    });
  });
}

async function addSampleConsultations() {
  return new Promise((resolve, reject) => {
    const consultations = [
      {
        resident_id: 1,
        doctor_id: 3,
        diagnosis: 'Hypertension Stage 1',
        findings: 'Elevated blood pressure readings, patient asymptomatic',
        health_condition: 'At Risk',
        illness_type: 'Chronic',
        prescription: 'Losartan 50mg once daily',
        follow_up_date: '2024-04-15'
      },
      {
        resident_id: 4,
        doctor_id: 3,
        diagnosis: 'Upper Respiratory Tract Infection',
        findings: 'Patient presents with cough and colds, no fever',
        health_condition: 'Sick',
        illness_type: 'Viral',
        prescription: 'Paracetamol 500mg every 6 hours PRN for fever',
        follow_up_date: '2024-04-10'
      }
    ];

    let completedConsultations = 0;
    
    consultations.forEach((consultation) => {
      const columns = Object.keys(consultation).join(', ');
      const placeholders = Object.keys(consultation).map(() => '?').join(', ');
      const values = Object.values(consultation);

      db.run(
        `INSERT OR IGNORE INTO consultations (${columns}) VALUES (${placeholders})`,
        values,
        function(err) {
          if (err) {
            console.error('Error inserting consultation:', err);
          } else {
            console.log(`Consultation added for resident ${consultation.resident_id}`);
          }
          
          completedConsultations++;
          if (completedConsultations === consultations.length) {
            // Add sample assessments
            addSampleAssessments().then(resolve).catch(reject);
          }
        }
      );
    });
  });
}

async function addSampleAssessments() {
  return new Promise((resolve, reject) => {
    const assessments = [
      {
        resident_id: 2,
        consultation_date: '2024-03-25',
        assessed_by: 'RHU Staff',
        comorbidities: 'None',
        personal_history: 'No significant medical history',
        family_history: 'Mother has hypertension',
        smoking_history: 'Never Smoked',
        social_history: 'Non-drinker, non-smoker',
        alcohol_intake: 'No',
        physical_activity: 'Yes',
        diagnosis: 'Generally healthy, routine checkup',
        treatment_plan: 'Continue healthy lifestyle, annual checkup'
      },
      {
        resident_id: 5,
        consultation_date: '2024-03-25',
        assessed_by: 'RHU Staff',
        comorbidities: 'None',
        personal_history: 'History of asthma in childhood',
        family_history: 'Father has diabetes',
        smoking_history: 'Less than/Equal to 1 pack per day',
        social_history: 'Social drinker',
        alcohol_intake: 'Yes',
        physical_activity: 'No',
        diagnosis: 'Risk factors for metabolic syndrome',
        treatment_plan: 'Lifestyle modification, smoking cessation'
      }
    ];

    let completedAssessments = 0;
    
    assessments.forEach((assessment) => {
      const columns = Object.keys(assessment).join(', ');
      const placeholders = Object.keys(assessment).map(() => '?').join(', ');
      const values = Object.values(assessment);

      db.run(
        `INSERT OR IGNORE INTO assessments (${columns}) VALUES (${placeholders})`,
        values,
        function(err) {
          if (err) {
            console.error('Error inserting assessment:', err);
          } else {
            console.log(`Assessment added for resident ${assessment.resident_id}`);
          }
          
          completedAssessments++;
          if (completedAssessments === assessments.length) {
            console.log('Sample data added successfully!');
            resolve();
          }
        }
      );
    });
  });
}

// Run the script
addSampleData().then(() => {
  db.close();
}).catch((err) => {
  console.error('Error adding sample data:', err);
  db.close();
});
