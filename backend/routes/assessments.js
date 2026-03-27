const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

// Get assessment by resident ID
router.get('/resident/:residentId', authenticateToken, authorizeRole(['rhu', 'doctor']), (req, res) => {
  const { residentId } = req.params;

  db.get(
    'SELECT * FROM assessments WHERE resident_id = ? ORDER BY created_at DESC LIMIT 1',
    [residentId],
    (err, assessment) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!assessment) {
        return res.status(404).json({ error: 'Assessment not found' });
      }

      res.json(assessment);
    }
  );
});

// Create or update assessment (RHU Staff and Barangay Encoders)
router.post('/', authenticateToken, authorizeRole(['rhu', 'barangay']), (req, res) => {
  const assessmentData = req.body;
  assessmentData.created_at = new Date().toISOString();
  assessmentData.updated_at = new Date().toISOString();

  // Check if assessment already exists for this resident
  db.get(
    'SELECT id FROM assessments WHERE resident_id = ?',
    [assessmentData.resident_id],
    (err, existingAssessment) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingAssessment) {
        // Update existing assessment
        const setClause = Object.keys(assessmentData).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(assessmentData), assessmentData.resident_id];

        db.run(
          `UPDATE assessments SET ${setClause} WHERE resident_id = ?`,
          values,
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to update assessment' });
            }

            // Update resident status to "Ready for Doctor Consultation"
            db.run(
              'UPDATE residents SET status = ?, updated_at = ? WHERE id = ?',
              ['Ready for Doctor Consultation', new Date().toISOString(), assessmentData.resident_id],
              (err) => {
                if (err) {
                  console.error('Error updating resident status:', err);
                }
              }
            );

            res.json({ message: 'Assessment updated successfully' });
          }
        );
      } else {
        // Create new assessment
        const columns = Object.keys(assessmentData).join(', ');
        const placeholders = Object.keys(assessmentData).map(() => '?').join(', ');
        const values = Object.values(assessmentData);

        db.run(
          `INSERT INTO assessments (${columns}) VALUES (${placeholders})`,
          values,
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create assessment' });
            }

            // Update resident status to "Ready for Doctor Consultation"
            db.run(
              'UPDATE residents SET status = ?, updated_at = ? WHERE id = ?',
              ['Ready for Doctor Consultation', new Date().toISOString(), assessmentData.resident_id],
              (err) => {
                if (err) {
                  console.error('Error updating resident status:', err);
                }
              }
            );

            res.status(201).json({
              id: this.lastID,
              message: 'Assessment created successfully'
            });
          }
        );
      }
    }
  );
});

// Get all assessments (for reports)
router.get('/', authenticateToken, authorizeRole(['rhu', 'doctor']), (req, res) => {
  const { dateFrom, dateTo, barangay } = req.query;

  let query = `
    SELECT a.*, r.first_name, r.last_name, r.barangay 
    FROM assessments a 
    JOIN residents r ON a.resident_id = r.id 
    WHERE 1=1
  `;
  const params = [];

  if (dateFrom) {
    query += ' AND a.consultation_date >= ?';
    params.push(dateFrom);
  }

  if (dateTo) {
    query += ' AND a.consultation_date <= ?';
    params.push(dateTo);
  }

  if (barangay) {
    query += ' AND r.barangay = ?';
    params.push(barangay);
  }

  query += ' ORDER BY a.created_at DESC';

  db.all(query, params, (err, assessments) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(assessments);
  });
});

module.exports = router;
