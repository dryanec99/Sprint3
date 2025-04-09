// routes/food.js
const express = require('express');
const router = express.Router();
const db = require('../services/db'); // adjust path if different

// GET all available food items with donor names
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT f.*, u.name AS donor_name
            FROM food_items f
            JOIN users u ON f.donorID = u.userID
            WHERE f.status = 'Available'
            ORDER BY f.created_at DESC
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Failed to fetch food items' });
    }
});

module.exports = router;
