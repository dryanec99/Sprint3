// managereservations.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

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

// Get all reservations with detailed information for volunteer dashboard
router.get('/all', async (req, res) => {
    try {
        const query = `
            SELECT r.reservationID, r.recipientID, r.foodID, r.status, r.pickupDate, 
                   r.created_at as reservationDate, 
                   u.name as recipientName,
                   COALESCE(f.name, 'Unknown Item') as foodName, 
                   COALESCE(f.quantity, 1) as quantity, 
                   COALESCE(fr.location, 'Not specified') as location, 
                   COALESCE(f.expirationDate, 'Not specified') as expirationDate
            FROM reservations r
            LEFT JOIN food_items f ON r.foodID = f.foodID
            LEFT JOIN fridges fr ON f.fridgeID = fr.fridgeID
            LEFT JOIN users u ON r.recipientID = u.userID
            ORDER BY r.created_at DESC
        `;
        
        const results = await db.query(query);
        console.log(`Found ${results.length} reservations for volunteer dashboard`);
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching all reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
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