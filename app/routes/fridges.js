// routes/fridges.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET all fridge locations
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT fridgeID, location, capacity, currentStock
            FROM fridges
            ORDER BY location
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching fridge locations:', error);
        res.status(500).json({ error: 'Failed to fetch fridge locations' });
    }
});

module.exports = router;
