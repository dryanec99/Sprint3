// feedback.js - API routes for recipient feedback
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Submit feedback for a food pickup
router.post('/submit', async (req, res) => {
    try {
        const { userId, reservationId, rating, comments } = req.body;
        
        if (!userId || !reservationId || !rating || !comments) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if feedback already exists for this reservation
        const checkQuery = `
            SELECT id FROM feedback 
            WHERE reservation_id = ?
        `;
        
        const existingFeedback = await db.query(checkQuery, [reservationId]);
        
        if (existingFeedback.length > 0) {
            return res.status(400).json({ error: 'Feedback already submitted for this reservation' });
        }
        
        // Insert feedback
        const insertQuery = `
            INSERT INTO feedback (user_id, reservation_id, rating, comments, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        
        const result = await db.query(insertQuery, [userId, reservationId, rating, comments]);
        
        if (!result || !result.insertId) {
            return res.status(500).json({ error: 'Failed to insert feedback' });
        }
        
        const feedbackId = result.insertId;
        
        // Award points for providing feedback
        try {
            const response = await fetch(`${req.protocol}://${req.get('host')}/api/recipient-points/award-feedback-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    feedbackId
                })
            });
            
            if (!response.ok) {
                // Just log the error if points award fails
                console.error('Failed to award points for feedback');
            }
            
            // Check if user qualifies for the Feedback Provider achievement
            await fetch(`${req.protocol}://${req.get('host')}/api/auto-achievements/check-feedback/${userId}`, {
                method: 'POST'
            }).catch(err => {
                console.error('Error checking feedback achievements:', err);
                // Don't fail the whole request if achievement check fails
            });
        } catch (pointsError) {
            // Don't fail the whole request if points award fails
            console.error('Error awarding points for feedback:', pointsError);
        }
        
        // Update reservation status to indicate feedback was provided
        const updateQuery = `
            UPDATE reservations
            SET feedback_provided = 1
            WHERE reservationID = ?
        `;
        
        await db.query(updateQuery, [reservationId]);
        
        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            feedbackId
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'An error occurred while submitting feedback' });
    }
});

// Get feedback for a specific reservation
router.get('/reservation/:reservationId', async (req, res) => {
    try {
        const { reservationId } = req.params;
        
        const query = `
            SELECT f.id, f.user_id, f.reservation_id, f.rating, f.comments, f.created_at,
                   u.name as user_name
            FROM feedback f
            JOIN users u ON f.user_id = u.userID
            WHERE f.reservation_id = ?
        `;
        
        const results = await db.query(query, [reservationId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'An error occurred while fetching feedback' });
    }
});

// Get all feedback provided by a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT f.id, f.reservation_id, f.rating, f.comments, f.created_at,
                   r.foodID, fi.name as food_name
            FROM feedback f
            JOIN reservations r ON f.reservation_id = r.reservationID
            LEFT JOIN food_items fi ON r.foodID = fi.foodID
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
        `;
        
        const results = await db.query(query, [userId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching user feedback:', error);
        res.status(500).json({ error: 'An error occurred while fetching user feedback' });
    }
});

module.exports = router;
