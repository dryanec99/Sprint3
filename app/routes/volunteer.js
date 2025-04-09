// volunteer.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get volunteer profile
router.get('/profile', async (req, res) => {
    try {
        const { userId } = req.user;
        const query = 'SELECT * FROM volunteers WHERE user_id = ?';
        const results = await db.query(query, [userId]);
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update volunteer profile
router.put('/profile', async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, phone, availability, skills } = req.body;
        const query = `
            UPDATE volunteers 
            SET name = ?, phone = ?, availability = ?, skills = ?
            WHERE user_id = ?
        `;
        await db.query(query, [name, phone, availability, skills, userId]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get available shifts
router.get('/shifts', async (req, res) => {
    try {
        const query = `
            SELECT * FROM volunteer_shifts 
            WHERE status = 'available' 
            AND shift_date > NOW()
            ORDER BY shift_date ASC
        `;
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sign up for a shift
router.post('/shifts/:shiftId/signup', async (req, res) => {
    try {
        const { userId } = req.user;
        const { shiftId } = req.params;
        
        // Check if shift is available
        const checkQuery = 'SELECT * FROM volunteer_shifts WHERE id = ? AND status = "available"';
        const [shift] = await db.query(checkQuery, [shiftId]);
        
        if (!shift) {
            return res.status(400).json({ error: 'Shift not available' });
        }

        // Sign up for shift
        const signupQuery = `
            INSERT INTO volunteer_assignments (volunteer_id, shift_id, status)
            VALUES (?, ?, 'scheduled')
        `;
        await db.query(signupQuery, [userId, shiftId]);
        
        // Update shift status
        const updateQuery = 'UPDATE volunteer_shifts SET status = "filled" WHERE id = ?';
        await db.query(updateQuery, [shiftId]);
        
        res.json({ message: 'Successfully signed up for shift' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get volunteer's scheduled shifts
router.get('/my-shifts', async (req, res) => {
    try {
        const { userId } = req.user;
        const query = `
            SELECT vs.*, va.status as assignment_status
            FROM volunteer_shifts vs
            JOIN volunteer_assignments va ON vs.id = va.shift_id
            WHERE va.volunteer_id = ?
            ORDER BY vs.shift_date ASC
        `;
        const results = await db.query(query, [userId]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel a shift
router.delete('/shifts/:shiftId/cancel', async (req, res) => {
    try {
        const { userId } = req.user;
        const { shiftId } = req.params;
        
        // Remove assignment
        const deleteQuery = 'DELETE FROM volunteer_assignments WHERE volunteer_id = ? AND shift_id = ?';
        await db.query(deleteQuery, [userId, shiftId]);
        
        // Update shift status
        const updateQuery = 'UPDATE volunteer_shifts SET status = "available" WHERE id = ?';
        await db.query(updateQuery, [shiftId]);
        
        res.json({ message: 'Shift cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 