// viewfood.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get all available food items (default route)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                f.foodID,
                f.name,
                f.quantity,
                f.expirationDate,
                f.status,
                fr.location
            FROM food_items f
            JOIN fridges fr ON f.fridgeID = fr.fridgeID
            WHERE f.status = 'Available'
            ORDER BY f.expirationDate ASC
        `;
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get all available food items (explicit /all route)
router.get('/all', async (req, res) => {
    try {
        const query = `
            SELECT 
                f.foodID,
                f.name,
                f.quantity,
                f.expirationDate,
                f.status,
                fr.location
            FROM food_items f
            JOIN fridges fr ON f.fridgeID = fr.fridgeID
            WHERE f.status = 'Available'
            ORDER BY f.expirationDate ASC
        `;
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get food items by fridge location
router.get('/location/:fridgeID', async (req, res) => {
    try {
        const { fridgeID } = req.params;
        const query = `
            SELECT 
                f.foodID,
                f.name,
                f.quantity,
                f.expirationDate,
                f.status,
                fr.location
            FROM food_items f
            JOIN fridges fr ON f.fridgeID = fr.fridgeID
            WHERE f.fridgeID = ? AND f.status = 'Available'
            ORDER BY f.expirationDate ASC
        `;
        const results = await db.query(query, [fridgeID]);
        res.json(results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get food items by expiry date range
router.get('/expiry', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = `
            SELECT 
                f.foodID,
                f.name,
                f.quantity,
                f.expirationDate,
                f.status,
                fr.location
            FROM food_items f
            JOIN fridges fr ON f.fridgeID = fr.fridgeID
            WHERE f.expirationDate BETWEEN ? AND ? AND f.status = 'Available'
            ORDER BY f.expirationDate ASC
        `;
        const results = await db.query(query, [startDate, endDate]);
        res.json(results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get food item details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                f.foodID,
                f.name,
                f.quantity,
                f.expirationDate,
                f.status,
                fr.location,
                u.name as donorName
            FROM food_items f
            JOIN fridges fr ON f.fridgeID = fr.fridgeID
            JOIN users u ON f.donorID = u.userID
            WHERE f.foodID = ?
        `;
        const results = await db.query(query, [id]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Search food items
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const searchQuery = `
            SELECT 
                f.foodID,
                f.name,
                f.quantity,
                f.expirationDate,
                f.status,
                fr.location
            FROM food_items f
            JOIN fridges fr ON f.fridgeID = fr.fridgeID
            WHERE f.name LIKE ? AND f.status = 'Available'
            ORDER BY f.expirationDate ASC
        `;
        const searchTerm = `%${query}%`;
        const results = await db.query(searchQuery, [searchTerm]);
        res.json(results);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;