// reservefood.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Get available food items
router.get('/available', async (req, res) => {
    try {
        const query = `
            SELECT i.*, c.name as category_name 
            FROM inventory i
            JOIN categories c ON i.category_id = c.id
            WHERE i.quantity > 0 AND i.expiry_date > NOW()
            ORDER BY i.expiry_date ASC
        `;
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reserve food items
router.post('/reserve', async (req, res) => {
    try {
        const { userId } = req.user;
        const { items } = req.body; // items should be an array of {food_id, quantity}

        // Start transaction
        await db.query('START TRANSACTION');

        try {
            for (const item of items) {
                // Check availability
                const checkQuery = 'SELECT quantity FROM inventory WHERE id = ? FOR UPDATE';
                const [food] = await db.query(checkQuery, [item.food_id]);

                if (!food || food.quantity < item.quantity) {
                    throw new Error(`Not enough quantity available for item ${item.food_id}`);
                }

                // Create reservation
                const reserveQuery = `
                    INSERT INTO reservations (user_id, food_id, quantity, status)
                    VALUES (?, ?, ?, 'pending')
                `;
                await db.query(reserveQuery, [userId, item.food_id, item.quantity]);

                // Update inventory
                const updateQuery = 'UPDATE inventory SET quantity = quantity - ? WHERE id = ?';
                await db.query(updateQuery, [item.quantity, item.food_id]);
            }

            await db.query('COMMIT');
            res.json({ message: 'Food items reserved successfully' });
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reservation details
router.get('/reservation/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        
        const query = `
            SELECT r.*, i.name as food_name, i.expiry_date, c.name as category_name
            FROM reservations r
            JOIN inventory i ON r.food_id = i.id
            JOIN categories c ON i.category_id = c.id
            WHERE r.id = ? AND r.user_id = ?
        `;
        const results = await db.query(query, [id, userId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 