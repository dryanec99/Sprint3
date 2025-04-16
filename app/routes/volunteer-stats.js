// volunteer-stats.js - API routes for volunteer statistics
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get inventory updates count for a volunteer
router.get('/inventory-updates/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Count inventory updates made by the volunteer
        const query = `
            SELECT COUNT(*) as count
            FROM inventory_updates
            WHERE volunteer_id = ?
        `;
        
        // If the inventory_updates table doesn't exist yet, create a placeholder response
        try {
            const results = await db.query(query, [userId]);
            res.json({ count: results[0].count || 0 });
        } catch (error) {
            console.error('Error querying inventory updates:', error);
            // Return 0 if table doesn't exist or other error
            res.json({ count: 0 });
        }
    } catch (error) {
        console.error('Error fetching inventory updates count:', error);
        res.status(500).json({ error: 'An error occurred while fetching inventory updates count' });
    }
});

// Get reservations managed count for a volunteer
router.get('/reservations-managed/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Count reservations managed by the volunteer
        const query = `
            SELECT COUNT(*) as count
            FROM reservation_updates
            WHERE volunteer_id = ?
        `;
        
        // If the reservation_updates table doesn't exist yet, create a placeholder response
        try {
            const results = await db.query(query, [userId]);
            res.json({ count: results[0].count || 0 });
        } catch (error) {
            console.error('Error querying reservation updates:', error);
            // Return 0 if table doesn't exist or other error
            res.json({ count: 0 });
        }
    } catch (error) {
        console.error('Error fetching reservations managed count:', error);
        res.status(500).json({ error: 'An error occurred while fetching reservations managed count' });
    }
});

// Award points for inventory management
router.post('/award-inventory-points', async (req, res) => {
    try {
        const { userId, itemId, actionType } = req.body;
        
        if (!userId || !itemId || !actionType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if points have already been awarded for this action
        const checkQuery = `
            SELECT id FROM point_transactions 
            WHERE user_id = ? AND action_type = 'INVENTORY' AND reference_id = ?
        `;
        
        const existingPoints = await db.query(checkQuery, [userId, itemId]);
        
        if (existingPoints.length > 0) {
            return res.status(400).json({ error: 'Points already awarded for this inventory action' });
        }
        
        // Call the points API to award points
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/points/volunteer/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                actionType: 'INVENTORY',
                referenceId: itemId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to award points');
        }
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error awarding inventory points:', error);
        res.status(500).json({ error: 'An error occurred while awarding points' });
    }
});

// Award points for reservation management
router.post('/award-reservation-points', async (req, res) => {
    try {
        const { userId, reservationId, actionType } = req.body;
        
        if (!userId || !reservationId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if points have already been awarded for this action
        const checkQuery = `
            SELECT id FROM point_transactions 
            WHERE user_id = ? AND action_type = 'RESERVATION_MANAGEMENT' AND reference_id = ?
        `;
        
        const existingPoints = await db.query(checkQuery, [userId, reservationId]);
        
        if (existingPoints.length > 0) {
            return res.status(400).json({ error: 'Points already awarded for this reservation management action' });
        }
        
        // Call the points API to award points
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/points/volunteer/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                actionType: 'RESERVATION_MANAGEMENT',
                referenceId: reservationId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to award points');
        }
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error awarding reservation management points:', error);
        res.status(500).json({ error: 'An error occurred while awarding points' });
    }
});

module.exports = router;
