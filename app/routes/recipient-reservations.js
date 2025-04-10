// routes/recipient-reservations.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get all reservations for a recipient
router.get('/:recipientId', async (req, res) => {
    try {
        const { recipientId } = req.params;
        
        console.log('Fetching reservations for recipient ID:', recipientId);
        
        if (!recipientId) {
            return res.status(400).json({ error: 'Recipient ID is required' });
        }
        
        const query = `
            SELECT r.reservationID, r.recipientID, r.foodID, r.status, r.pickupDate, 
                   r.created_at as reservationDate, 
                   COALESCE(f.name, 'Unknown Item') as foodName, 
                   COALESCE(f.quantity, 1) as quantity, 
                   COALESCE(f.location, 'Not specified') as location, 
                   COALESCE(f.expirationDate, 'Not specified') as expirationDate
            FROM reservations r
            LEFT JOIN food_items f ON r.foodID = f.foodID
            WHERE r.recipientID = ?
            ORDER BY r.created_at DESC
        `;
        
        // Use the query function directly without destructuring
        const results = await db.query(query, [recipientId]);
        
        console.log(`Found ${results.length} reservations for recipient ${recipientId}`);
        console.log('First reservation:', results[0] || 'No reservations found');
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations', details: error.message });
    }
});

// Get reservation by ID
router.get('/details/:reservationId', async (req, res) => {
    try {
        const { reservationId } = req.params;
        
        const query = `
            SELECT r.*, f.name as foodName, f.quantity, f.location, f.expirationDate
            FROM reservations r
            JOIN food_items f ON r.foodID = f.foodID
            WHERE r.reservationID = ?
        `;
        
        const results = await db.query(query, [reservationId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching reservation details:', error);
        res.status(500).json({ error: 'Failed to fetch reservation details', details: error.message });
    }
});

module.exports = router;
