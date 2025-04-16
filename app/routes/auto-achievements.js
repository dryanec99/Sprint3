// auto-achievements.js - Automatically award achievements to users
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Award the "Newcomer" achievement to all users who don't have it yet
router.post('/award-newcomer', async (req, res) => {
    try {
        // Find the Newcomer achievement ID
        const findAchievementQuery = `
            SELECT id FROM achievements WHERE name = 'Newcomer'
        `;
        
        const achievementResults = await db.query(findAchievementQuery);
        
        if (achievementResults.length === 0) {
            return res.status(404).json({ error: 'Newcomer achievement not found' });
        }
        
        const achievementId = achievementResults[0].id;
        
        // Find all users who don't have the Newcomer achievement yet
        const findUsersQuery = `
            SELECT u.userID
            FROM users u
            LEFT JOIN user_achievements ua ON u.userID = ua.user_id AND ua.achievement_id = ?
            WHERE ua.id IS NULL
        `;
        
        const userResults = await db.query(findUsersQuery, [achievementId]);
        
        if (userResults.length === 0) {
            return res.json({ message: 'All users already have the Newcomer achievement', count: 0 });
        }
        
        // Award the Newcomer achievement to each user
        const awardedUsers = [];
        
        for (const user of userResults) {
            try {
                // Add the achievement
                await db.query(
                    'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                    [user.userID, achievementId]
                );
                
                // Add points transaction (0 points for Newcomer)
                await db.query(
                    `INSERT INTO point_transactions (user_id, points, action_type, description)
                     VALUES (?, ?, 'ACHIEVEMENT', ?)`,
                    [user.userID, 0, 'Joined the Community Fridge network']
                );
                
                awardedUsers.push(user.userID);
            } catch (innerError) {
                console.error(`Error awarding achievement to user ${user.userID}:`, innerError);
                // Continue with other users even if one fails
            }
        }
        
        res.json({
            success: true,
            message: 'Newcomer achievement awarded to users',
            users: awardedUsers,
            count: awardedUsers.length
        });
    } catch (error) {
        console.error('Error awarding Newcomer achievement:', error);
        res.status(500).json({ error: 'An error occurred while awarding achievements' });
    }
});

// Award the "Active Member" achievement to eligible users
router.post('/award-active-member', async (req, res) => {
    try {
        // Find the Active Member achievement ID
        const findAchievementQuery = `
            SELECT id FROM achievements WHERE name = 'Active Member'
        `;
        
        const achievementResults = await db.query(findAchievementQuery);
        
        if (achievementResults.length === 0) {
            return res.status(404).json({ error: 'Active Member achievement not found' });
        }
        
        const achievementId = achievementResults[0].id;
        
        // Find users who have been active for at least 30 days but don't have the achievement yet
        const findUsersQuery = `
            SELECT u.userID
            FROM users u
            LEFT JOIN user_achievements ua ON u.userID = ua.user_id AND ua.achievement_id = ?
            WHERE ua.id IS NULL
            AND DATEDIFF(NOW(), u.created_at) >= 30
        `;
        
        const userResults = await db.query(findUsersQuery, [achievementId]);
        
        if (userResults.length === 0) {
            return res.json({ message: 'No eligible users for Active Member achievement', count: 0 });
        }
        
        // Award the Active Member achievement to each eligible user
        const awardedUsers = [];
        
        for (const user of userResults) {
            try {
                // Add the achievement
                await db.query(
                    'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                    [user.userID, achievementId]
                );
                
                // Add points transaction (30 points for Active Member)
                await db.query(
                    `INSERT INTO point_transactions (user_id, points, action_type, description)
                     VALUES (?, ?, 'ACHIEVEMENT', ?)`,
                    [user.userID, 30, 'Been active for 30 days']
                );
                
                // Update user points
                await db.query(
                    `INSERT INTO user_points (user_id, total_points, level)
                     VALUES (?, 30, 1)
                     ON DUPLICATE KEY UPDATE 
                     total_points = total_points + 30,
                     level = FLOOR(SQRT(total_points + 30) / 10) + 1`,
                    [user.userID]
                );
                
                awardedUsers.push(user.userID);
            } catch (innerError) {
                console.error(`Error awarding achievement to user ${user.userID}:`, innerError);
                // Continue with other users even if one fails
            }
        }
        
        res.json({
            success: true,
            message: 'Active Member achievement awarded to eligible users',
            users: awardedUsers,
            count: awardedUsers.length
        });
    } catch (error) {
        console.error('Error awarding Active Member achievement:', error);
        res.status(500).json({ error: 'An error occurred while awarding achievements' });
    }
});

// Check for achievements based on feedback count
router.post('/check-feedback/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Find the Feedback Provider achievement ID
        const findAchievementQuery = `
            SELECT id FROM achievements WHERE name = 'Feedback Provider'
        `;
        
        const achievementResults = await db.query(findAchievementQuery);
        
        if (achievementResults.length === 0) {
            return res.status(404).json({ error: 'Feedback Provider achievement not found' });
        }
        
        const achievementId = achievementResults[0].id;
        
        // Check if user already has this achievement
        const checkExistingQuery = `
            SELECT id FROM user_achievements 
            WHERE user_id = ? AND achievement_id = ?
        `;
        
        const existingResults = await db.query(checkExistingQuery, [userId, achievementId]);
        
        if (existingResults.length > 0) {
            return res.json({ 
                success: true, 
                message: 'User already has Feedback Provider achievement',
                alreadyAwarded: true
            });
        }
        
        // Count user's feedback submissions
        const countFeedbackQuery = `
            SELECT COUNT(*) as feedbackCount 
            FROM feedback 
            WHERE user_id = ?
        `;
        
        const feedbackResults = await db.query(countFeedbackQuery, [userId]);
        const feedbackCount = feedbackResults[0].feedbackCount;
        
        // Award achievement if user has provided at least 5 feedback submissions
        if (feedbackCount >= 5) {
            // Add the achievement
            await db.query(
                'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                [userId, achievementId]
            );
            
            // Add points transaction (20 points for Feedback Provider)
            await db.query(
                `INSERT INTO point_transactions (user_id, points, action_type, description)
                 VALUES (?, ?, 'ACHIEVEMENT', ?)`,
                [userId, 20, 'Provided feedback on 5 food pickups']
            );
            
            // Update user points
            await db.query(
                `INSERT INTO user_points (user_id, total_points, level)
                 VALUES (?, 20, 1)
                 ON DUPLICATE KEY UPDATE 
                 total_points = total_points + 20,
                 level = FLOOR(SQRT(total_points + 20) / 10) + 1`,
                [userId]
            );
            
            return res.json({
                success: true,
                message: 'Feedback Provider achievement awarded',
                awarded: true,
                points: 20
            });
        }
        
        res.json({
            success: true,
            message: 'User does not qualify for Feedback Provider achievement yet',
            awarded: false,
            currentCount: feedbackCount,
            requiredCount: 5
        });
    } catch (error) {
        console.error('Error checking feedback achievements:', error);
        res.status(500).json({ error: 'An error occurred while checking achievements' });
    }
});

// Check for achievements based on points
router.post('/check-points/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Get user's current points
        const pointsQuery = `
            SELECT total_points FROM user_points WHERE user_id = ?
        `;
        
        const pointsResults = await db.query(pointsQuery, [userId]);
        
        if (pointsResults.length === 0) {
            return res.status(404).json({ error: 'User points not found' });
        }
        
        const totalPoints = pointsResults[0].total_points;
        
        // Get all point-based achievements the user doesn't have yet
        const achievementsQuery = `
            SELECT a.id, a.name, a.points_required 
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = ?
            WHERE ua.id IS NULL
            AND a.points_required > 0
            AND a.points_required <= ?
            ORDER BY a.points_required ASC
        `;
        
        const achievementsResults = await db.query(achievementsQuery, [userId, totalPoints]);
        
        if (achievementsResults.length === 0) {
            return res.json({
                success: true,
                message: 'No new achievements to award',
                awarded: false
            });
        }
        
        // Award each achievement the user has qualified for
        const awardedAchievements = [];
        
        for (const achievement of achievementsResults) {
            try {
                // Add the achievement
                await db.query(
                    'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                    [userId, achievement.id]
                );
                
                // Add points transaction (10 points for each achievement)
                await db.query(
                    `INSERT INTO point_transactions (user_id, points, action_type, description)
                     VALUES (?, ?, 'ACHIEVEMENT', ?)`,
                    [userId, 10, `Reached ${achievement.points_required} points`]
                );
                
                // Update user points
                await db.query(
                    `UPDATE user_points 
                     SET total_points = total_points + 10,
                     level = FLOOR(SQRT(total_points + 10) / 10) + 1
                     WHERE user_id = ?`,
                    [userId]
                );
                
                awardedAchievements.push({
                    id: achievement.id,
                    name: achievement.name,
                    pointsRequired: achievement.points_required
                });
            } catch (innerError) {
                console.error(`Error awarding achievement ${achievement.id} to user ${userId}:`, innerError);
                // Continue with other achievements even if one fails
            }
        }
        
        res.json({
            success: true,
            message: 'Awarded new achievements based on points',
            awarded: true,
            achievements: awardedAchievements,
            bonusPoints: awardedAchievements.length * 10
        });
    } catch (error) {
        console.error('Error checking points-based achievements:', error);
        res.status(500).json({ error: 'An error occurred while checking achievements' });
    }
});

// Check for achievements based on reservation count
router.post('/check-reservations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Find the Regular Visitor achievement ID
        const findAchievementQuery = `
            SELECT id FROM achievements WHERE name = 'Regular Visitor'
        `;
        
        const achievementResults = await db.query(findAchievementQuery);
        
        if (achievementResults.length === 0) {
            return res.status(404).json({ error: 'Regular Visitor achievement not found' });
        }
        
        const achievementId = achievementResults[0].id;
        
        // Check if user already has this achievement
        const checkExistingQuery = `
            SELECT id FROM user_achievements 
            WHERE user_id = ? AND achievement_id = ?
        `;
        
        const existingResults = await db.query(checkExistingQuery, [userId, achievementId]);
        
        if (existingResults.length > 0) {
            return res.json({ 
                success: true, 
                message: 'User already has Regular Visitor achievement',
                alreadyAwarded: true
            });
        }
        
        // Count user's reservations
        const countReservationsQuery = `
            SELECT COUNT(*) as reservationCount 
            FROM reservations 
            WHERE recipientID = ?
        `;
        
        const reservationResults = await db.query(countReservationsQuery, [userId]);
        const reservationCount = reservationResults[0].reservationCount;
        
        // Award achievement if user has made at least 15 reservations
        if (reservationCount >= 15) {
            // Add the achievement
            await db.query(
                'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                [userId, achievementId]
            );
            
            // Add points transaction (25 points for Regular Visitor)
            await db.query(
                `INSERT INTO point_transactions (user_id, points, action_type, description)
                 VALUES (?, ?, 'ACHIEVEMENT', ?)`,
                [userId, 25, 'Made 15 or more food reservations']
            );
            
            // Update user points
            await db.query(
                `INSERT INTO user_points (user_id, total_points, level)
                 VALUES (?, 25, 1)
                 ON DUPLICATE KEY UPDATE 
                 total_points = total_points + 25,
                 level = FLOOR(SQRT(total_points + 25) / 10) + 1`,
                [userId]
            );
            
            return res.json({
                success: true,
                message: 'Regular Visitor achievement awarded',
                awarded: true,
                points: 25
            });
        }
        
        res.json({
            success: true,
            message: 'User does not qualify for Regular Visitor achievement yet',
            awarded: false,
            currentCount: reservationCount,
            requiredCount: 15
        });
    } catch (error) {
        console.error('Error checking reservation achievements:', error);
        res.status(500).json({ error: 'An error occurred while checking achievements' });
    }
});

// Check for volunteer-specific achievements
router.post('/check-volunteer/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Check if user is a volunteer
        const userQuery = `SELECT role FROM users WHERE userID = ?`;
        const userResult = await db.query(userQuery, [userId]);
        
        if (userResult.length === 0 || userResult[0].role !== 'Volunteer') {
            return res.status(400).json({ error: 'User is not a volunteer' });
        }
        
        // Find the Inventory Manager achievement ID
        const findAchievementQuery = `
            SELECT id FROM achievements WHERE name = 'Inventory Manager'
        `;
        
        const achievementResults = await db.query(findAchievementQuery);
        
        if (achievementResults.length === 0) {
            return res.status(404).json({ error: 'Inventory Manager achievement not found' });
        }
        
        const achievementId = achievementResults[0].id;
        
        // Check if user already has this achievement
        const checkExistingQuery = `
            SELECT id FROM user_achievements 
            WHERE user_id = ? AND achievement_id = ?
        `;
        
        const existingResults = await db.query(checkExistingQuery, [userId, achievementId]);
        
        if (existingResults.length > 0) {
            return res.json({ 
                success: true, 
                message: 'User already has Inventory Manager achievement',
                alreadyAwarded: true
            });
        }
        
        // Count inventory actions by the volunteer
        // This is a placeholder query - adjust based on your actual database schema
        const countActionsQuery = `
            SELECT COUNT(*) as actionCount 
            FROM point_transactions 
            WHERE user_id = ? AND action_type = 'INVENTORY'
        `;
        
        const actionsResults = await db.query(countActionsQuery, [userId]);
        const actionCount = actionsResults[0].actionCount;
        
        // Award achievement if user has performed at least 10 inventory actions
        if (actionCount >= 10) {
            // Add the achievement
            await db.query(
                'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)',
                [userId, achievementId]
            );
            
            // Add points transaction (30 points for Inventory Manager)
            await db.query(
                `INSERT INTO point_transactions (user_id, points, action_type, description)
                 VALUES (?, ?, 'ACHIEVEMENT', ?)`,
                [userId, 30, 'Managed inventory 10 or more times']
            );
            
            // Update user points
            await db.query(
                `INSERT INTO user_points (user_id, total_points, level)
                 VALUES (?, 30, 1)
                 ON DUPLICATE KEY UPDATE 
                 total_points = total_points + 30,
                 level = FLOOR(SQRT(total_points + 30) / 10) + 1`,
                [userId]
            );
            
            return res.json({
                success: true,
                message: 'Inventory Manager achievement awarded',
                awarded: true,
                points: 30
            });
        }
        
        res.json({
            success: true,
            message: 'User does not qualify for Inventory Manager achievement yet',
            awarded: false,
            currentCount: actionCount,
            requiredCount: 10
        });
    } catch (error) {
        console.error('Error checking volunteer achievements:', error);
        res.status(500).json({ error: 'An error occurred while checking achievements' });
    }
});

// Check all achievements for a user
router.post('/check-all/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        
        // Get user role
        const userQuery = `SELECT role FROM users WHERE userID = ?`;
        const userResult = await db.query(userQuery, [userId]);
        
        if (userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const userRole = userResult[0].role;
        
        // Check all types of achievements
        const checkResults = {};
        
        // 1. Check feedback-based achievements (for recipients)
        if (userRole === 'Recipient') {
            const feedbackResponse = await fetch(`${req.protocol}://${req.get('host')}/api/auto-achievements/check-feedback/${userId}`, {
                method: 'POST'
            }).then(res => res.json()).catch(err => {
                console.error('Error checking feedback achievements:', err);
                return { success: false, error: err.message };
            });
            
            checkResults.feedback = feedbackResponse;
        }
        
        // 2. Check reservation-based achievements (for recipients)
        if (userRole === 'Recipient') {
            const reservationResponse = await fetch(`${req.protocol}://${req.get('host')}/api/auto-achievements/check-reservations/${userId}`, {
                method: 'POST'
            }).then(res => res.json()).catch(err => {
                console.error('Error checking reservation achievements:', err);
                return { success: false, error: err.message };
            });
            
            checkResults.reservations = reservationResponse;
        }
        
        // 3. Check volunteer-specific achievements
        if (userRole === 'Volunteer') {
            const volunteerResponse = await fetch(`${req.protocol}://${req.get('host')}/api/auto-achievements/check-volunteer/${userId}`, {
                method: 'POST'
            }).then(res => res.json()).catch(err => {
                console.error('Error checking volunteer achievements:', err);
                return { success: false, error: err.message };
            });
            
            checkResults.volunteer = volunteerResponse;
        }
        
        // 4. Check points-based achievements (for all roles)
        const pointsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/auto-achievements/check-points/${userId}`, {
            method: 'POST'
        }).then(res => res.json()).catch(err => {
            console.error('Error checking points-based achievements:', err);
            return { success: false, error: err.message };
        });
        
        checkResults.points = pointsResponse;
        
        // Determine if any new achievements were awarded
        const anyAwarded = Object.values(checkResults).some(result => result.awarded === true);
        
        res.json({
            success: true,
            message: anyAwarded ? 'New achievements awarded' : 'No new achievements awarded',
            anyAwarded,
            results: checkResults
        });
    } catch (error) {
        console.error('Error checking all achievements:', error);
        res.status(500).json({ error: 'An error occurred while checking achievements' });
    }
});

module.exports = router;
