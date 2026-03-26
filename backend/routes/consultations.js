const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

// Create consultation (Doctor only)
router.post('/', authenticateToken, authorizeRole(['doctor']), async (req, res) => {
  const consultationData = req.body;
  consultationData.doctor_id = req.user.id;
  consultationData.created_at = new Date().toISOString();
  consultationData.updated_at = new Date().toISOString();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Insert consultation
    const columns = Object.keys(consultationData).join(', ');
    const placeholders = Object.keys(consultationData).map(() => '?').join(', ');
    const values = Object.values(consultationData);

    db.run(
      `INSERT INTO consultations (${columns}) VALUES (${placeholders})`,
      values,
      async function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to create consultation' });
        }

        try {
          // Generate YAKAP ID
          const yakapId = `YAKAP-${String(this.lastID).padStart(6, '0')}`;
          
          // Get resident info for QR code
          db.get(
            'SELECT first_name, last_name, barangay FROM residents WHERE id = ?',
            [consultationData.resident_id],
            async (err, resident) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Failed to get resident info' });
              }

              // Create QR code data (privacy-safe)
              const qrData = {
                yakapId,
                name: `${resident.first_name} ${resident.last_name}`,
                barangay: resident.barangay
              };

              const qrCodeData = JSON.stringify(qrData);
              const qrCodeImage = await QRCode.toDataURL(qrCodeData);

              // Insert YAKAP ID
              db.run(
                'INSERT INTO yakap_ids (resident_id, yakap_id, qr_code_data) VALUES (?, ?, ?)',
                [consultationData.resident_id, yakapId, qrCodeImage],
                function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Failed to generate YAKAP ID' });
                  }

                  // Update resident status to "Completed"
                  db.run(
                    'UPDATE residents SET status = ?, updated_at = ? WHERE id = ?',
                    ['Completed', new Date().toISOString(), consultationData.resident_id],
                    (err) => {
                      if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Failed to update resident status' });
                      }

                      db.run('COMMIT');
                      res.status(201).json({
                        consultationId: this.lastID,
                        yakapId,
                        message: 'Consultation completed successfully'
                      });
                    }
                  );
                }
              );
            }
          );
        } catch (error) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to generate QR code' });
        }
      }
    );
  });
});

// Get consultations by resident ID
router.get('/resident/:residentId', authenticateToken, (req, res) => {
  const { residentId } = req.params;
  const { role } = req.user;

  let query = `
    SELECT c.*, u.full_name as doctor_name 
    FROM consultations c 
    JOIN users u ON c.doctor_id = u.id 
    WHERE c.resident_id = ?
    ORDER BY c.created_at DESC
  `;

  db.all(query, [residentId], (err, consultations) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Role-based filtering
    if (role === 'barangay') {
      // Barangay users see limited consultation info
      const limitedConsultations = consultations.map(c => ({
        id: c.id,
        created_at: c.created_at,
        follow_up_date: c.follow_up_date,
        doctor_name: c.doctor_name
      }));
      return res.json(limitedConsultations);
    }

    res.json(consultations);
  });
});

// Get YAKAP ID by resident ID
router.get('/yakap/:residentId', authenticateToken, (req, res) => {
  const { residentId } = req.params;

  db.get(
    'SELECT * FROM yakap_ids WHERE resident_id = ?',
    [residentId],
    (err, yakapId) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!yakapId) {
        return res.status(404).json({ error: 'YAKAP ID not found' });
      }

      res.json(yakapId);
    }
  );
});

// Get all consultations (for reports)
router.get('/', authenticateToken, authorizeRole(['doctor', 'rhu']), (req, res) => {
  const { dateFrom, dateTo, barangay, healthCondition } = req.query;

  let query = `
    SELECT c.*, r.first_name, r.last_name, r.barangay, u.full_name as doctor_name 
    FROM consultations c 
    JOIN residents r ON c.resident_id = r.id 
    JOIN users u ON c.doctor_id = u.id 
    WHERE 1=1
  `;
  const params = [];

  if (dateFrom) {
    query += ' AND c.created_at >= ?';
    params.push(dateFrom);
  }

  if (dateTo) {
    query += ' AND c.created_at <= ?';
    params.push(dateTo);
  }

  if (barangay) {
    query += ' AND r.barangay = ?';
    params.push(barangay);
  }

  if (healthCondition) {
    query += ' AND c.health_condition = ?';
    params.push(healthCondition);
  }

  query += ' ORDER BY c.created_at DESC';

  db.all(query, params, (err, consultations) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(consultations);
  });
});

module.exports = router;
