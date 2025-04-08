// sendnotifications.js
const express = require('express');
const router = express.Router();
const db = require('./db');

// Send notification to all users
router.post('/broadcast', async (req, res) => {
    try {
        const { title, message, type } = req.body;
        const query = `
            INSERT INTO notifications (title, message, type, recipient_type)
            VALUES (?, ?, ?, 'all')
        `;
        const result = await db.query(query, [title, message, type]);
        res.json({ id: result.insertId, message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send notification to specific user
router.post('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, message, type } = req.body;
        const query = `
            INSERT INTO notifications (title, message, type, user_id)
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.query(query, [title, message, type, userId]);
        res.json({ id: result.insertId, message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send notification to all recipients
router.post('/recipients', async (req, res) => {
    try {
        const { title, message, type } = req.body;
        const query = `
            INSERT INTO notifications (title, message, type, recipient_type)
            SELECT ?, ?, ?, 'recipient'
            FROM users u
            JOIN recipients r ON u.id = r.user_id
        `;
        const result = await db.query(query, [title, message, type]);
        res.json({ message: 'Notifications sent to all recipients successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send notification to all donors
router.post('/donors', async (req, res) => {
    try {
        const { title, message, type } = req.body;
        const query = `
            INSERT INTO notifications (title, message, type, recipient_type)
            SELECT ?, ?, ?, 'donor'
            FROM users u
            JOIN donors d ON u.id = d.user_id
        `;
        const result = await db.query(query, [title, message, type]);
        res.json({ message: 'Notifications sent to all donors successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all notifications
router.get('/history', async (req, res) => {
    try {
        const query = 'SELECT * FROM notifications ORDER BY created_at DESC';
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 