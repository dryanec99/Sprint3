// managereservations.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all reservations
router.get('/reservations', async (req, res) => {
    try {
        const query = 'SELECT * FROM reservations';
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reservation by ID
router.get('/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM reservations WHERE id = ?';
        const results = await db.query(query, [id]);
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update reservation status
router.put('/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const query = 'UPDATE reservations SET status = ? WHERE id = ?';
        await db.query(query, [status, id]);
        res.json({ message: 'Reservation updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel reservation
router.delete('/reservations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM reservations WHERE id = ?';
        await db.query(query, [id]);
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 