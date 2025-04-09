// viewfood.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all food items
router.get('/all', async (req, res) => {
    try {
        const query = `
            SELECT i.*, c.name as category_name 
            FROM inventory i
            JOIN categories c ON i.category_id = c.id
            ORDER BY i.expiry_date ASC
        `;
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get food items by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const query = `
            SELECT i.*, c.name as category_name 
            FROM inventory i
            JOIN categories c ON i.category_id = c.id
            WHERE i.category_id = ?
            ORDER BY i.expiry_date ASC
        `;
        const results = await db.query(query, [categoryId]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get food items by expiry date range
router.get('/expiry', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = `
            SELECT i.*, c.name as category_name 
            FROM inventory i
            JOIN categories c ON i.category_id = c.id
            WHERE i.expiry_date BETWEEN ? AND ?
            ORDER BY i.expiry_date ASC
        `;
        const results = await db.query(query, [startDate, endDate]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get food item details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT i.*, c.name as category_name 
            FROM inventory i
            JOIN categories c ON i.category_id = c.id
            WHERE i.id = ?
        `;
        const results = await db.query(query, [id]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search food items
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const searchQuery = `
            SELECT i.*, c.name as category_name 
            FROM inventory i
            JOIN categories c ON i.category_id = c.id
            WHERE i.name LIKE ? OR i.description LIKE ?
            ORDER BY i.expiry_date ASC
        `;
        const searchTerm = `%${query}%`;
        const results = await db.query(searchQuery, [searchTerm, searchTerm]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 