// manageinventory.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all inventory items
router.get('/inventory', async (req, res) => {
    try {
        const query = 'SELECT * FROM inventory';
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new inventory item
router.post('/inventory', async (req, res) => {
    try {
        const { name, quantity, expiry_date, category } = req.body;
        const query = 'INSERT INTO inventory (name, quantity, expiry_date, category) VALUES (?, ?, ?, ?)';
        const result = await db.query(query, [name, quantity, expiry_date, category]);
        res.json({ id: result.insertId, message: 'Item added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update inventory item
router.put('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, expiry_date, category } = req.body;
        const query = 'UPDATE inventory SET name = ?, quantity = ?, expiry_date = ?, category = ? WHERE id = ?';
        await db.query(query, [name, quantity, expiry_date, category, id]);
        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete inventory item
router.delete('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM inventory WHERE id = ?';
        await db.query(query, [id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 