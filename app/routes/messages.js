// routes/messages.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get all messages for a user (inbox)
router.get('/inbox/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const query = `
            SELECT m.*, u.name as senderName, u.role as senderRole
            FROM messages m
            JOIN users u ON m.senderID = u.userID
            WHERE m.receiverID = ?
            ORDER BY m.created_at DESC
        `;
        const results = await db.query(query, [userId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching inbox messages:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all sent messages for a user
router.get('/sent/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const query = `
            SELECT m.*, u.name as receiverName, u.role as receiverRole
            FROM messages m
            JOIN users u ON m.receiverID = u.userID
            WHERE m.senderID = ?
            ORDER BY m.created_at DESC
        `;
        const results = await db.query(query, [userId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sent messages:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get a specific message by ID
router.get('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const query = `
            SELECT m.*, 
                sender.name as senderName, sender.role as senderRole,
                receiver.name as receiverName, receiver.role as receiverRole
            FROM messages m
            JOIN users sender ON m.senderID = sender.userID
            JOIN users receiver ON m.receiverID = receiver.userID
            WHERE m.messageID = ?
        `;
        const results = await db.query(query, [messageId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        
        // Mark message as read if it's not already
        if (!results[0].isRead) {
            const updateQuery = 'UPDATE messages SET isRead = 1 WHERE messageID = ?';
            await db.query(updateQuery, [messageId]);
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send a new message
router.post('/', async (req, res) => {
    try {
        const { senderID, receiverID, subject, content } = req.body;
        
        // Validate required fields
        if (!senderID || !receiverID || !subject || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check if sender and receiver exist
        const userQuery = 'SELECT userID FROM users WHERE userID IN (?, ?)';
        const userResults = await db.query(userQuery, [senderID, receiverID]);
        
        if (userResults.length < 2) {
            return res.status(400).json({ error: 'Invalid sender or receiver' });
        }
        
        // Insert new message
        const insertQuery = `
            INSERT INTO messages (senderID, receiverID, subject, content)
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.query(insertQuery, [senderID, receiverID, subject, content]);
        
        res.status(201).json({ 
            messageID: result.insertId,
            message: 'Message sent successfully' 
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a message
router.delete('/:messageId', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { userId } = req.body; // The user requesting deletion
        
        // Check if the message exists and belongs to the user
        const checkQuery = 'SELECT * FROM messages WHERE messageID = ? AND (senderID = ? OR receiverID = ?)';
        const checkResults = await db.query(checkQuery, [messageId, userId, userId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ error: 'Message not found or you do not have permission to delete it' });
        }
        
        // Delete the message
        const deleteQuery = 'DELETE FROM messages WHERE messageID = ?';
        await db.query(deleteQuery, [messageId]);
        
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark a message as read
router.patch('/:messageId/read', async (req, res) => {
    try {
        const { messageId } = req.params;
        const { userId } = req.body; // The user marking as read
        
        // Check if the message exists and belongs to the user
        const checkQuery = 'SELECT * FROM messages WHERE messageID = ? AND receiverID = ?';
        const checkResults = await db.query(checkQuery, [messageId, userId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ error: 'Message not found or you do not have permission to mark it as read' });
        }
        
        // Mark as read
        const updateQuery = 'UPDATE messages SET isRead = 1 WHERE messageID = ?';
        await db.query(updateQuery, [messageId]);
        
        res.json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all users for messaging (to select recipients)
router.get('/users/all', async (req, res) => {
    try {
        const query = 'SELECT userID, name, role FROM users ORDER BY name';
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
