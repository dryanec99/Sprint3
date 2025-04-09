// manageinventory.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

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

// Move item to another fridge
router.post('/move-item', async (req, res) => {
    try {
        const { itemId, fromFridgeId, toFridgeId, quantity } = req.body;
        
        // First, get the current item details
        const getItemQuery = 'SELECT * FROM food_items WHERE foodID = ?';
        const itemResults = await db.query(getItemQuery, [itemId]);
        
        if (itemResults.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        const item = itemResults[0];
        const moveQuantity = parseInt(quantity);
        
        // Check if we're moving all or part of the quantity
        if (moveQuantity >= item.quantity) {
            // Moving all - just update the fridge ID
            const updateQuery = 'UPDATE food_items SET fridgeID = ? WHERE foodID = ?';
            await db.query(updateQuery, [toFridgeId, itemId]);
            
            res.json({ 
                message: 'Item moved successfully',
                type: 'full',
                itemId: itemId
            });
        } else {
            // Moving part - reduce quantity in original item and create a new item
            // 1. Reduce quantity in original item
            const updateOriginalQuery = 'UPDATE food_items SET quantity = quantity - ? WHERE foodID = ?';
            await db.query(updateOriginalQuery, [moveQuantity, itemId]);
            
            // 2. Create a new item in the destination fridge
            const createNewQuery = `
                INSERT INTO food_items 
                (name, category_id, quantity, expirationDate, status, fridgeID, donorID) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const result = await db.query(createNewQuery, [
                item.name,
                item.category_id,
                moveQuantity,
                item.expirationDate,
                item.status,
                toFridgeId,
                item.donorID
            ]);
            
            res.json({ 
                message: 'Item partially moved successfully',
                type: 'partial',
                originalItemId: itemId,
                newItemId: result.insertId
            });
        }
    } catch (error) {
        console.error('Error moving item:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 