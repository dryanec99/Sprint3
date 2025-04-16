// points.js - API routes for the points system
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Get user points and level
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT up.user_id, up.total_points, up.level, u.name, u.role
            FROM user_points up
            JOIN users u ON up.user_id = u.userID
            WHERE up.user_id = ?
        `;
        
        const results = await db.query(query, [userId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User points not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching user points:', error);
        res.status(500).json({ error: 'An error occurred while fetching user points' });
    }
});

// Get user's point transactions
router.get('/transactions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT id, points, action_type, description, created_at
            FROM point_transactions
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 20
        `;
        
        const results = await db.query(query, [userId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching point transactions:', error);
        res.status(500).json({ error: 'An error occurred while fetching point transactions' });
    }
});

// Get user's achievements
router.get('/achievements/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const query = `
            SELECT a.id, a.name, a.description, a.icon, ua.earned_at
            FROM user_achievements ua
            JOIN achievements a ON ua.achievement_id = a.id
            WHERE ua.user_id = ?
            ORDER BY ua.earned_at DESC
        `;
        
        const results = await db.query(query, [userId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        res.status(500).json({ error: 'An error occurred while fetching user achievements' });
    }
});

// Get available achievements for a user role
router.get('/available-achievements/:role', async (req, res) => {
    try {
        const { role } = req.params;
        
        const query = `
            SELECT id, name, description, icon, points_required
            FROM achievements
            WHERE role = ? OR role = 'All'
            ORDER BY points_required ASC
        `;
        
        const results = await db.query(query, [role]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching available achievements:', error);
        res.status(500).json({ error: 'An error occurred while fetching available achievements' });
    }
});

// Get community leaderboard
router.get('/leaderboard/:role?', async (req, res) => {
    try {
        const { role } = req.params;
        
        let query = `
            SELECT up.user_id, u.name, u.role, up.total_points, up.level,
                   (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = up.user_id) as achievements_count
            FROM user_points up
            JOIN users u ON up.user_id = u.userID
        `;
        
        const params = [];
        
        if (role) {
            query += ` WHERE u.role = ?`;
            params.push(role);
        }
        
        query += ` ORDER BY up.total_points DESC LIMIT 10`;
        
        const results = await db.query(query, params);
        res.json(results);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'An error occurred while fetching leaderboard' });
    }
});

// Add points to a user (for testing and admin purposes)
router.post('/add', async (req, res) => {
    try {
        const { userId, points, actionType, referenceId, description } = req.body;
        
        if (!userId || !points || !actionType || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Begin transaction
        await db.beginTransaction();
        
        // Add points transaction
        const transactionQuery = `
            INSERT INTO point_transactions (user_id, points, action_type, reference_id, description)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        await db.query(transactionQuery, [userId, points, actionType, referenceId || null, description]);
        
        // Update user points
        const updatePointsQuery = `
            INSERT INTO user_points (user_id, total_points, level)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE 
            total_points = total_points + ?,
            level = FLOOR(SQRT(total_points + ?) / 10) + 1
        `;
        
        await db.query(updatePointsQuery, [userId, points, points, points]);
        
        // Get updated user points
        const getUserPointsQuery = `
            SELECT total_points, level FROM user_points WHERE user_id = ?
        `;
        
        const userPointsResults = await db.query(getUserPointsQuery, [userId]);
        
        if (userPointsResults.length === 0) {
            await db.rollback();
            return res.status(404).json({ error: 'User points not found after update' });
        }
        
        const { total_points, level } = userPointsResults[0];
        
        // Check for new achievements
        const checkAchievementsQuery = `
            SELECT id, name, description, icon
            FROM achievements
            WHERE points_required <= ?
            AND (role = (SELECT role FROM users WHERE userID = ?) OR role = 'All')
            AND id NOT IN (
                SELECT achievement_id FROM user_achievements WHERE user_id = ?
            )
        `;
        
        const newAchievements = await db.query(
            checkAchievementsQuery, 
            [total_points, userId, userId]
        );
        
        // Award new achievements
        for (const achievement of newAchievements) {
            await db.query(
                'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                [userId, achievement.id]
            );
        }
        
        // Commit transaction
        await db.commit();
        
        res.json({
            success: true,
            points_added: points,
            new_total: total_points,
            new_level: level,
            new_achievements: newAchievements
        });
    } catch (error) {
        await db.rollback();
        console.error('Error adding points:', error);
        res.status(500).json({ error: 'An error occurred while adding points' });
    }
});

// Award points for specific recipient actions
router.post('/recipient/action', async (req, res) => {
    try {
        const { userId, actionType, referenceId } = req.body;
        
        if (!userId || !actionType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Define point values for different recipient actions
        const pointValues = {
            'RESERVATION': 5,       // Points for making a reservation
            'PICKUP': 10,           // Points for completing a pickup
            'FEEDBACK': 15,         // Points for leaving feedback
            'CONTAINER_RETURN': 20, // Points for returning containers
            'COMMUNITY_EVENT': 25   // Points for participating in community events
        };
        
        // Check if action type is valid
        if (!pointValues[actionType]) {
            return res.status(400).json({ error: 'Invalid action type' });
        }
        
        // Generate description based on action type
        const descriptions = {
            'RESERVATION': 'Made a food reservation',
            'PICKUP': 'Completed a food pickup',
            'FEEDBACK': 'Provided feedback on food quality',
            'CONTAINER_RETURN': 'Returned containers to community fridge',
            'COMMUNITY_EVENT': 'Participated in a community event'
        };
        
        // Get points and description for this action
        const pointsToAdd = pointValues[actionType];
        const description = descriptions[actionType];
        
        // Add points transaction
        const insertTransactionQuery = `
            INSERT INTO point_transactions (user_id, points, action_type, reference_id, description, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        const transactionResult = await db.query(
            insertTransactionQuery, 
            [userId, pointsToAdd, actionType, referenceId || null, description]
        );
        
        if (!transactionResult || !transactionResult.insertId) {
            throw new Error('Failed to insert point transaction');
        }
        
        // Update user points or create if not exists
        const updatePointsQuery = `
            INSERT INTO user_points (user_id, total_points, level)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE 
            total_points = total_points + ?,
            level = FLOOR(SQRT(total_points + ?) / 10) + 1
        `;
        
        await db.query(updatePointsQuery, [userId, pointsToAdd, pointsToAdd, pointsToAdd]);
        
        // Check if user has earned any achievements based on points
        const checkAchievementsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/auto-achievements/check-points/${userId}`, {
            method: 'POST'
        }).catch(err => {
            console.error('Error checking achievements:', err);
            // Don't fail the whole request if achievement check fails
            return { ok: false };
        });
        
        res.json({
            success: true,
            message: `Added ${pointsToAdd} points for ${actionType.toLowerCase()}`,
            points: pointsToAdd,
            actionType,
            description
        });
    } catch (error) {
        console.error('Error adding recipient points:', error);
        res.status(500).json({ error: 'An error occurred while adding recipient points' });
    }
});

// Award points for volunteer actions
router.post('/volunteer/action', async (req, res) => {
    try {
        const { userId, actionType, referenceId } = req.body;
        
        if (!userId || !actionType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Define point values for different volunteer actions
        const pointValues = {
            'INVENTORY': 10,             // Points for managing inventory
            'RESERVATION_MANAGEMENT': 15, // Points for managing reservations
            'NOTIFICATION': 5,           // Points for sending notifications
            'FRIDGE_MAINTENANCE': 20,    // Points for maintaining the fridge
            'COMMUNITY_EVENT': 25        // Points for organizing community events
        };
        
        // Check if action type is valid
        if (!pointValues[actionType]) {
            return res.status(400).json({ error: 'Invalid action type' });
        }
        
        // Generate description based on action type
        const descriptions = {
            'INVENTORY': 'Updated fridge inventory',
            'RESERVATION_MANAGEMENT': 'Managed food reservation',
            'NOTIFICATION': 'Sent community notification',
            'FRIDGE_MAINTENANCE': 'Performed fridge maintenance',
            'COMMUNITY_EVENT': 'Organized community event'
        };
        
        // Get points and description for this action
        const pointsToAdd = pointValues[actionType];
        const description = descriptions[actionType];
        
        // Add points transaction
        const insertTransactionQuery = `
            INSERT INTO point_transactions (user_id, points, action_type, reference_id, description, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())
        `;
        
        const transactionResult = await db.query(
            insertTransactionQuery, 
            [userId, pointsToAdd, actionType, referenceId || null, description]
        );
        
        if (!transactionResult || !transactionResult.insertId) {
            throw new Error('Failed to insert point transaction');
        }
        
        // Update user points or create if not exists
        const updatePointsQuery = `
            INSERT INTO user_points (user_id, total_points, level)
            VALUES (?, ?, 1)
            ON DUPLICATE KEY UPDATE 
            total_points = total_points + ?,
            level = FLOOR(SQRT(total_points + ?) / 10) + 1
        `;
        
        await db.query(updatePointsQuery, [userId, pointsToAdd, pointsToAdd, pointsToAdd]);
        
        // Check if user has earned any achievements based on points
        const checkAchievementsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/auto-achievements/check-points/${userId}`, {
            method: 'POST'
        }).catch(err => {
            console.error('Error checking achievements:', err);
            // Don't fail the whole request if achievement check fails
            return { ok: false };
        });
        
        res.json({
            success: true,
            message: `Added ${pointsToAdd} points for ${actionType.toLowerCase()}`,
            points: pointsToAdd,
            actionType,
            description
        });
    } catch (error) {
        console.error('Error adding volunteer points:', error);
        res.status(500).json({ error: 'An error occurred while adding volunteer points' });
    }
});

module.exports = router;
