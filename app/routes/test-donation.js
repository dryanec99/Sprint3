// Test script for direct database insertion
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Test endpoint that directly inserts into both tables
router.get('/insert-test', async (req, res) => {
    console.log('==== DIRECT INSERTION TEST ENDPOINT CALLED ====');
    
    try {
        // Get a connection for transaction
        console.log('Getting database connection for transaction');
        let connection;
        try {
            connection = await db.getConnection();
            console.log('Database connection obtained successfully');
        } catch (connError) {
            console.error('Error getting database connection:', connError);
            return res.status(500).json({ 
                error: 'Failed to connect to database', 
                details: connError.message 
            });
        }
        
        try {
            // Start transaction
            console.log('Beginning transaction');
            await connection.beginTransaction();
            console.log('Transaction started successfully');
            
            // Test data
            const donor_id = 1; // Using a known donor ID
            const foodName = 'Test Apple';
            const category = 'Fruits'; // Added category field
            const quantity = 5;
            const today = new Date().toISOString().split('T')[0];
            const expiration = '2025-05-01';
            const description = 'Test donation insertion';
            const fridgeID = 1;
            
            // 1. Insert into donations table
            const donationQuery = `
                INSERT INTO donations (
                    donor_id, 
                    food_name, 
                    quantity, 
                    donation_date, 
                    expiry_date, 
                    notes
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            console.log('Executing donation query with values:', [
                donor_id, 
                foodName, 
                quantity, 
                today, 
                expiration, 
                description
            ]);
            
            let donationResult;
            try {
                [donationResult] = await connection.execute(
                    donationQuery, 
                    [donor_id, foodName, quantity, today, expiration, description]
                );
                console.log('Donation insert result:', donationResult);
            } catch (donationError) {
                console.error('Error executing donation insert query:', donationError);
                throw new Error('Failed to insert donation: ' + donationError.message);
            }
            
            // 2. Insert into food_items table
            const foodItemQuery = `
                INSERT INTO food_items (
                    donorID,
                    name,
                    category,
                    quantity,
                    expirationDate,
                    status,
                    fridgeID,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, 'Available', ?, NOW())
            `;
            
            console.log('Executing food_items query with values:', [
                donor_id,
                foodName,
                category,
                quantity,
                expiration,
                fridgeID
            ]);
            
            let foodItemResult;
            try {
                [foodItemResult] = await connection.execute(
                    foodItemQuery,
                    [donor_id, foodName, category, quantity, expiration, fridgeID]
                );
                console.log('Food item insert result:', foodItemResult);
            } catch (foodItemError) {
                console.error('Error executing food_items insert query:', foodItemError);
                throw new Error('Failed to insert food item: ' + foodItemError.message);
            }
            
            // If we got here, both inserts were successful
            console.log('Both inserts successful, committing transaction');
            await connection.commit();
            
            console.log('Transaction committed successfully');
            res.status(200).json({ 
                success: true, 
                message: 'Test donation added successfully',
                donationId: donationResult.insertId,
                foodItemId: foodItemResult.insertId
            });
            
        } catch (dbError) {
            // If any error occurred, roll back the transaction
            console.error('Error in transaction, rolling back:', dbError);
            if (connection) {
                try {
                    await connection.rollback();
                    console.log('Transaction rolled back successfully');
                } catch (rollbackError) {
                    console.error('Error rolling back transaction:', rollbackError);
                }
            }
            res.status(500).json({ 
                error: 'Database error', 
                details: dbError.message 
            });
        } finally {
            // Always release the connection back to the pool
            if (connection) {
                try {
                    connection.release();
                    console.log('Database connection released');
                } catch (releaseError) {
                    console.error('Error releasing connection:', releaseError);
                }
            }
        }
    } catch (error) {
        console.error('Error in test endpoint:', error);
        res.status(500).json({ 
            error: 'An error occurred during the test', 
            details: error.message 
        });
    }
});

module.exports = router;
