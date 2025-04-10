// reservefood.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

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

// Reserve multiple food items from basket
router.post('/basket', async (req, res) => {
    try {
        const { recipientId, pickupLocation, pickupDate, contactInfo, additionalNotes, items } = req.body;
        
        console.log('Received reservation request:', { recipientId, pickupLocation, pickupDate, items });
        
        if (!recipientId || !pickupLocation || !pickupDate || !contactInfo || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Start a transaction to ensure all reservations are processed together
        const connection = await db.getConnection();
        await connection.beginTransaction();
        
        try {
            // Process each food item in the basket as a separate reservation
            // (since the reservations table has a direct foodID field)
            const createdReservations = [];
            
            for (const item of items) {
                // Check if food item exists and has enough quantity
                const checkFoodQuery = `
                    SELECT * FROM food_items 
                    WHERE foodID = ? AND quantity >= ?
                `;
                
                const [foodResults] = await connection.query(checkFoodQuery, [item.foodId, item.quantity]);
                
                if (!foodResults || foodResults.length === 0) {
                    console.log(`Food item with ID ${item.foodId} not found or has insufficient quantity`);
                    continue; // Skip this item but continue with others
                }
                
                // Create reservation record for this food item
                const reservationQuery = `
                    INSERT INTO reservations (recipientID, foodID, status, pickupDate, created_at)
                    VALUES (?, ?, 'Pending', ?, NOW())
                `;
                
                const [result] = await connection.query(reservationQuery, [
                    recipientId,
                    item.foodId,
                    pickupDate
                ]);
                
                createdReservations.push({
                    reservationId: result.insertId,
                    foodId: item.foodId,
                    quantity: item.quantity
                });
                
                // Update food item quantity
                const updateFoodQuery = `
                    UPDATE food_items 
                    SET quantity = quantity - ?, 
                        status = CASE WHEN (quantity - ?) <= 0 THEN 'Reserved' ELSE status END
                    WHERE foodID = ?
                `;
                
                await connection.query(updateFoodQuery, [
                    item.quantity,
                    item.quantity,
                    item.foodId
                ]);
            }
            
            // Commit the transaction if we created at least one reservation
            if (createdReservations.length > 0) {
                await connection.commit();
                
                // Return success response
                res.status(201).json({
                    success: true,
                    message: 'Reservations created successfully',
                    reservations: createdReservations
                });
            } else {
                // If no reservations were created, rollback and return an error
                await connection.rollback();
                res.status(400).json({
                    success: false,
                    message: 'No valid food items found in basket'
                });
            }
        } catch (error) {
            // Rollback transaction if there's an error
            await connection.rollback();
            console.error('Transaction error:', error);
            throw error;
        } finally {
            // Release the connection
            connection.release();
        }
        
    } catch (error) {
        console.error('Error creating basket reservation:', error);
        res.status(500).json({ 
            error: 'Failed to create reservation', 
            details: error.message 
        });
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