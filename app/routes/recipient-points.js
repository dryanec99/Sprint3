// recipient-points.js - API routes for recipient points actions
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Award points for making a reservation
router.post('/award-reservation-points', async (req, res) => {
    try {
        const { userId, reservationId } = req.body;
        
        if (!userId || !reservationId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if points have already been awarded for this reservation
        const checkQuery = `
            SELECT id FROM point_transactions 
            WHERE user_id = ? AND action_type = 'RESERVATION' AND reference_id = ?
        `;
        
        const existingPoints = await db.query(checkQuery, [userId, reservationId]);
        
        if (existingPoints.length > 0) {
            return res.status(400).json({ error: 'Points already awarded for this reservation' });
        }
        
        // Call the points API to award points
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/points/recipient/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                actionType: 'RESERVATION',
                referenceId: reservationId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to award points');
        }
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error awarding reservation points:', error);
        res.status(500).json({ error: 'An error occurred while awarding points' });
    }
});

// Award points for completing a pickup
router.post('/award-pickup-points', async (req, res) => {
    try {
        const { userId, reservationId } = req.body;
        
        if (!userId || !reservationId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if points have already been awarded for this pickup
        const checkQuery = `
            SELECT id FROM point_transactions 
            WHERE user_id = ? AND action_type = 'PICKUP' AND reference_id = ?
        `;
        
        const existingPoints = await db.query(checkQuery, [userId, reservationId]);
        
        if (existingPoints.length > 0) {
            return res.status(400).json({ error: 'Points already awarded for this pickup' });
        }
        
        // Call the points API to award points
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/points/recipient/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                actionType: 'PICKUP',
                referenceId: reservationId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to award points');
        }
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error awarding pickup points:', error);
        res.status(500).json({ error: 'An error occurred while awarding points' });
    }
});

// Award points for providing feedback
router.post('/award-feedback-points', async (req, res) => {
    try {
        const { userId, feedbackId } = req.body;
        
        if (!userId || !feedbackId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if points have already been awarded for this feedback
        const checkQuery = `
            SELECT id FROM point_transactions 
            WHERE user_id = ? AND action_type = 'FEEDBACK' AND reference_id = ?
        `;
        
        const existingPoints = await db.query(checkQuery, [userId, feedbackId]);
        
        if (existingPoints.length > 0) {
            return res.status(400).json({ error: 'Points already awarded for this feedback' });
        }
        
        // Call the points API to award points
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/points/recipient/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                actionType: 'FEEDBACK',
                referenceId: feedbackId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to award points');
        }
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error awarding feedback points:', error);
        res.status(500).json({ error: 'An error occurred while awarding points' });
    }
});

// Award points for returning containers
router.post('/award-container-return-points', async (req, res) => {
    try {
        const { userId, containerId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Call the points API to award points
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/points/recipient/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                actionType: 'CONTAINER_RETURN',
                referenceId: containerId || null
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to award points');
        }
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error awarding container return points:', error);
        res.status(500).json({ error: 'An error occurred while awarding points' });
    }
});

// Award points for participating in community events
router.post('/award-event-points', async (req, res) => {
    try {
        const { userId, eventId } = req.body;
        
        if (!userId || !eventId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if points have already been awarded for this event
        const checkQuery = `
            SELECT id FROM point_transactions 
            WHERE user_id = ? AND action_type = 'COMMUNITY_EVENT' AND reference_id = ?
        `;
        
        const existingPoints = await db.query(checkQuery, [userId, eventId]);
        
        if (existingPoints.length > 0) {
            return res.status(400).json({ error: 'Points already awarded for this event' });
        }
        
        // Call the points API to award points
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/points/recipient/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                actionType: 'COMMUNITY_EVENT',
                referenceId: eventId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to award points');
        }
        
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error awarding event points:', error);
        res.status(500).json({ error: 'An error occurred while awarding points' });
    }
});

module.exports = router;
