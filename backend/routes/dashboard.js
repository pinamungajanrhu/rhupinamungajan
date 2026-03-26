const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

// Get dashboard statistics
router.get('/stats', authenticateToken, (req, res) => {
  const { role } = req.user;
  const { barangay } = req.query;

  let whereClause = 'WHERE 1=1';
  const params = [];

  // Role-based filtering
  if (role === 'barangay') {
    whereClause += ' AND r.created_by = ?';
    params.push(req.user.id);
  }

  if (barangay) {
    whereClause += ' AND r.barangay = ?';
    params.push(barangay);
  }

  const stats = {};

  // Total patients
  db.get(
    `SELECT COUNT(*) as total FROM residents r ${whereClause}`,
    params,
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.totalPatients = result.total;

      // Patients by status
      db.all(
        `SELECT r.status, COUNT(*) as count 
         FROM residents r ${whereClause} 
         GROUP BY r.status`,
        params,
        (err, results) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          
          stats.byStatus = {
            'Pending RHU Validation': 0,
            'Ready for Doctor Consultation': 0,
            'Completed': 0
          };

          results.forEach(row => {
            stats.byStatus[row.status] = row.count;
          });

          // Health condition distribution
          const healthQuery = role === 'barangay' 
            ? `SELECT 'Unknown' as health_condition, COUNT(*) as count 
               FROM residents r ${whereClause}`
            : `SELECT c.health_condition, COUNT(*) as count 
               FROM consultations c 
               JOIN residents r ON c.resident_id = r.id 
               ${whereClause} 
               GROUP BY c.health_condition`;

          db.all(healthQuery, params, (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            stats.byHealthCondition = {
              'Healthy': 0,
              'At Risk': 0,
              'Sick': 0,
              'Unknown': 0
            };

            results.forEach(row => {
              stats.byHealthCondition[row.health_condition] = row.count;
            });

            // PhilHealth coverage
            db.get(
              `SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN r.philhealth_number IS NOT NULL AND r.philhealth_number != '' THEN 1 END) as withPhilhealth
               FROM residents r ${whereClause}`,
              params,
              (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                
                stats.philhealthCoverage = {
                  total: result.total,
                  withPhilhealth: result.withPhilhealth,
                  percentage: result.total > 0 ? Math.round((result.withPhilhealth / result.total) * 100) : 0
                };

                res.json(stats);
              }
            );
          });
        }
      );
    }
  );
});

// Get illness type distribution
router.get('/illness-types', authenticateToken, (req, res) => {
  const { role } = req.user;
  const { barangay } = req.query;

  if (role === 'barangay') {
    // Barangay users don't see illness types
    return res.json([]);
  }

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (barangay) {
    whereClause += ' AND r.barangay = ?';
    params.push(barangay);
  }

  db.all(
    `SELECT c.illness_type, COUNT(*) as count 
     FROM consultations c 
     JOIN residents r ON c.resident_id = r.id 
     ${whereClause} 
     GROUP BY c.illness_type`,
    params,
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// Get barangay distribution
router.get('/barangay-distribution', authenticateToken, (req, res) => {
  const { role } = req.user;
  const { barangay } = req.query;

  let whereClause = 'WHERE 1=1';
  const params = [];

  // Role-based filtering
  if (role === 'barangay') {
    whereClause += ' AND r.created_by = ?';
    params.push(req.user.id);
  }

  if (barangay) {
    whereClause += ' AND r.barangay = ?';
    params.push(barangay);
  }

  db.all(
    `SELECT r.barangay, COUNT(*) as count 
     FROM residents r 
     ${whereClause} 
     GROUP BY r.barangay 
     ORDER BY count DESC`,
    params,
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
});

// Get recent activity
router.get('/recent-activity', authenticateToken, (req, res) => {
  const { role } = req.user;
  const { limit = 10 } = req.query;

  let query = '';
  let params = [];

  if (role === 'barangay') {
    query = `
      SELECT 'resident_registered' as activity_type, 
             r.first_name, r.last_name, r.barangay, 
             r.created_at as timestamp
      FROM residents r 
      WHERE r.created_by = ? 
      ORDER BY r.created_at DESC 
      LIMIT ?
    `;
    params = [req.user.id, parseInt(limit)];
  } else {
    query = `
      (SELECT 'consultation_completed' as activity_type, 
              r.first_name, r.last_name, r.barangay, 
              c.created_at as timestamp
       FROM consultations c 
       JOIN residents r ON c.resident_id = r.id 
       ORDER BY c.created_at DESC 
       LIMIT ?)
      UNION ALL
      (SELECT 'assessment_completed' as activity_type, 
              r.first_name, r.last_name, r.barangay, 
              a.created_at as timestamp
       FROM assessments a 
       JOIN residents r ON a.resident_id = r.id 
       ORDER BY a.created_at DESC 
       LIMIT ?)
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    params = [parseInt(limit), parseInt(limit), parseInt(limit)];
  }

  db.all(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

module.exports = router;
