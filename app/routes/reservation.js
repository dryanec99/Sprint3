// reservation.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get all reservations (for volunteers)
router.get('/all', async (req, res) => {
    try {
        console.log('Fetching all reservations for volunteer dashboard');
        
        // Simple query to get all reservations
        const simpleQuery = 'SELECT * FROM reservations';
        const simpleResults = await db.query(simpleQuery);
        console.log(`Found ${simpleResults.length} basic reservations`);
        
        // Detailed query with joins
        const query = `
            SELECT 
                r.reservationID as id, 
                r.recipientID, 
                r.foodID, 
                r.status, 
                r.pickupDate, 
                r.created_at as reservationDate, 
                u.name as recipientName,
                f.name as foodName, 
                f.quantity, 
                fr.location
            FROM 
                reservations r
            LEFT JOIN 
                food_items f ON r.foodID = f.foodID
            LEFT JOIN 
                fridges fr ON f.fridgeID = fr.fridgeID
            LEFT JOIN 
                users u ON r.recipientID = u.userID
            ORDER BY 
                r.created_at DESC
        `;
        
        try {
            const results = await db.query(query);
            console.log(`Found ${results.length} detailed reservations`);
            res.json(results);
        } catch (error) {
            console.error('Error with detailed query:', error);
            // If the detailed query fails, return the simple results
            res.json(simpleResults);
        }
    } catch (error) {
        console.error('Error fetching all reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
    }
});

// Get all reservations for a user
router.get('/my-reservations', async (req, res) => {
    try {
        const { userId } = req.user;
        const query = `
            SELECT r.*, i.name as food_name, i.expiry_date 
            FROM reservations r
            JOIN inventory i ON r.food_id = i.id
            WHERE r.user_id = ?
        `;
        const results = await db.query(query, [userId]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new reservation
router.post('/create', async (req, res) => {
    try {
        const { userId } = req.user;
        const { food_id, quantity, pickup_time } = req.body;
        
        // Check if food is available
        const checkQuery = 'SELECT quantity FROM inventory WHERE id = ?';
        const [food] = await db.query(checkQuery, [food_id]);
        
        if (!food || food.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough quantity available' });
        }

        const query = `
            INSERT INTO reservations (user_id, food_id, quantity, pickup_time, status) 
            VALUES (?, ?, ?, ?, 'pending')
        `;
        const result = await db.query(query, [userId, food_id, quantity, pickup_time]);
        
        // Update inventory
        const updateQuery = 'UPDATE inventory SET quantity = quantity - ? WHERE id = ?';
        await db.query(updateQuery, [quantity, food_id]);
        
        res.json({ id: result.insertId, message: 'Reservation created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel a reservation (for recipients)
router.delete('/cancel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        
        // Get reservation details
        const getQuery = 'SELECT * FROM reservations WHERE id = ? AND user_id = ?';
        const [reservation] = await db.query(getQuery, [id, userId]);
        
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update inventory
        const updateQuery = 'UPDATE inventory SET quantity = quantity + ? WHERE id = ?';
        await db.query(updateQuery, [reservation.quantity, reservation.food_id]);
        
        // Delete reservation
        const deleteQuery = 'DELETE FROM reservations WHERE id = ?';
        await db.query(deleteQuery, [id]);
        
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve a reservation (for volunteers)
router.put('/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`Approving reservation ${id}`);
        
        // Check if reservation exists
        const checkQuery = 'SELECT * FROM reservations WHERE reservationID = ?';
        const reservations = await db.query(checkQuery, [id]);
        
        if (reservations.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        // Update reservation status
        const updateQuery = 'UPDATE reservations SET status = ? WHERE reservationID = ?';
        await db.query(updateQuery, ['Confirmed', id]);
        
        res.json({ message: 'Reservation approved successfully' });
    } catch (error) {
        console.error('Error approving reservation:', error);
        res.status(500).json({ error: 'Failed to approve reservation', details: error.message });
    }
});

// Cancel a reservation (for volunteers)
router.put('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`Cancelling reservation ${id}`);
        
        // Check if reservation exists
        const checkQuery = 'SELECT * FROM reservations WHERE reservationID = ?';
        const reservations = await db.query(checkQuery, [id]);
        
        if (reservations.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        // Get reservation details to update inventory if needed
        const reservation = reservations[0];
        
        // Update food item status if needed
        if (reservation.foodID) {
            const updateFoodQuery = 'UPDATE food_items SET status = ? WHERE foodID = ?';
            await db.query(updateFoodQuery, ['Available', reservation.foodID]);
        }
        
        // Delete the reservation
        const deleteQuery = 'DELETE FROM reservations WHERE reservationID = ?';
        await db.query(deleteQuery, [id]);
        
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling reservation:', error);
        res.status(500).json({ error: 'Failed to cancel reservation', details: error.message });
    }
});

module.exports = router; 