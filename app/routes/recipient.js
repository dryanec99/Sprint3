// recipient.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get recipient profile
router.get('/profile', async (req, res) => {
    try {
        const { userId } = req.user;
        const query = 'SELECT * FROM recipients WHERE user_id = ?';
        const results = await db.query(query, [userId]);
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update recipient profile
router.put('/profile', async (req, res) => {
    try {
        const { userId } = req.user;
        const { name, address, phone, dietary_restrictions } = req.body;
        const query = 'UPDATE recipients SET name = ?, address = ?, phone = ?, dietary_restrictions = ? WHERE user_id = ?';
        await db.query(query, [name, address, phone, dietary_restrictions, userId]);
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get available food items
router.get('/available-food', async (req, res) => {
    try {
        const query = 'SELECT * FROM inventory WHERE quantity > 0 AND expiry_date > NOW()';
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Make a reservation
router.post('/reserve', async (req, res) => {
    try {
        const { userId } = req.user;
        const { food_id, quantity } = req.body;
        const query = 'INSERT INTO reservations (user_id, food_id, quantity, status) VALUES (?, ?, ?, "pending")';
        const result = await db.query(query, [userId, food_id, quantity]);
        res.json({ id: result.insertId, message: 'Reservation created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 