const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database', 'rhu.db');
const db = new sqlite3.Database(dbPath);

// Get all residents with role-based filtering
router.get('/', authenticateToken, (req, res) => {
  const { role, barangay: userBarangay } = req.user;
  const { status, barangay, search } = req.query;
  
  let query = 'SELECT * FROM residents WHERE 1=1';
  const params = [];

  // Role-based filtering
  if (role === 'barangay') {
    // Barangay users default to their assigned barangay, 
    // but can search globally across all of Pinamungajan
    if (search) {
      // Global search: no barangay filter applied when searching
    } else {
      // Default view: scoped to their assigned barangay
      query += ' AND barangay = ?';
      params.push(userBarangay);
    }
  }

  // Status filtering
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  // Explicit barangay filtering (from query params)
  if (barangay && role !== 'barangay') {
    query += ' AND barangay = ?';
    params.push(barangay);
  }

  // Search filtering
  if (search) {
    query += ' AND (first_name LIKE ? OR last_name LIKE ? OR mobile LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, residents) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(residents);
  });
});

// Check for duplicate resident
router.post('/check-duplicate', authenticateToken, (req, res) => {
  const { first_name, last_name, birthdate } = req.body;

  if (!first_name || !last_name || !birthdate) {
    return res.status(400).json({ error: 'First name, last name, and birthdate are required' });
  }

  db.get(
    'SELECT * FROM residents WHERE first_name = ? AND last_name = ? AND birthdate = ?',
    [first_name, last_name, birthdate],
    (err, resident) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (resident) {
        return res.json({ isDuplicate: true, resident });
      }

      res.json({ isDuplicate: false });
    }
  );
});

// Get resident by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  db.get('SELECT * FROM residents WHERE id = ?', [id], (err, resident) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    // Role-based data filtering
    if (role === 'barangay') {
      // Limit data for barangay users
      const limitedResident = {
        id: resident.id,
        first_name: resident.first_name,
        last_name: resident.last_name,
        birthdate: resident.birthdate,
        barangay: resident.barangay,
        mobile: resident.mobile,
        philhealth_number: resident.philhealth_number,
        status: resident.status,
        created_at: resident.created_at
      };
      return res.json(limitedResident);
    }

    res.json(resident);
  });
});

// Create new resident (Barangay Encoder and RHU Staff)
router.post('/', authenticateToken, authorizeRole(['barangay', 'rhu']), (req, res) => {
  const residentData = req.body;
  
  // Set initial status and created_by
  // If RHU staff creates it, auto-confirm them, otherwise Pending RHU Validation
  residentData.status = req.user.role === 'rhu' ? 'Awaiting Assessment' : 'Pending RHU Validation';
  residentData.created_by = req.user.id; // Add created_by field
  residentData.created_at = new Date().toISOString();
  
  const columns = Object.keys(residentData).join(', ');
  const placeholders = Object.keys(residentData).map(() => '?').join(', ');
  const values = Object.values(residentData);

  db.run(
    `INSERT INTO residents (${columns}) VALUES (${placeholders})`,
    values,
    function(err) {
      if (err) {
        console.error('Error creating resident:', err);
        return res.status(500).json({ error: 'Failed to create resident' });
      }

      res.status(201).json({
        id: this.lastID,
        message: 'Resident created successfully'
      });
    }
  );
});

// Update resident (RHU Staff and Doctor only)
router.put('/:id', authenticateToken, authorizeRole(['rhu', 'doctor']), (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  updateData.updated_at = new Date().toISOString();

  const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(updateData), id];

  db.run(
    `UPDATE residents SET ${setClause} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update resident' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Resident not found' });
      }

      res.json({ message: 'Resident updated successfully' });
    }
  );
});

// Get barangay list for dropdown
router.get('/barangays/list', authenticateToken, (req, res) => {
  db.all(
    'SELECT DISTINCT barangay FROM residents ORDER BY barangay',
    [],
    (err, barangays) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(barangays.map(b => b.barangay));
    }
  );
});

module.exports = router;
