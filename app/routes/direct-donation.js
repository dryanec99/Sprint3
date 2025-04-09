// direct-donation.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Direct donation endpoint that bypasses the normal flow
router.get('/insert-test-donation/:donorId', async (req, res) => {
    try {
        const donorId = parseInt(req.params.donorId, 10);
        
        if (isNaN(donorId) || donorId <= 0) {
            return res.status(400).json({ error: 'Invalid donor ID' });
        }
        
        console.log('==== DIRECT DONATION TEST ENDPOINT CALLED ====');
        console.log('Donor ID:', donorId);
        
        // Get current date for donation_date
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
        const expiry = expiryDate.toISOString().split('T')[0];
        
        // Get a connection for transaction
        let connection;
        try {
            connection = await db.getConnection();
            console.log('Database connection obtained successfully');
        } catch (connError) {
            console.error('Error getting database connection:', connError);
            throw new Error('Failed to connect to database: ' + connError.message);
        }
        
        try {
            // Start transaction
            await connection.beginTransaction();
            console.log('Transaction started successfully');
            
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
            
            const donationValues = [
                donorId, 
                'Test Food Item', 
                5, 
                today, 
                expiry, 
                'This is a test donation inserted directly'
            ];
            
            console.log('Executing donation query with values:', donationValues);
            
            let donationResult;
            try {
                [donationResult] = await connection.execute(donationQuery, donationValues);
                console.log('Donation insert result:', donationResult);
            } catch (donationError) {
                console.error('Error executing donation insert query:', donationError);
                throw new Error('Failed to insert donation: ' + donationError.message);
            }
            
            // 2. Insert into food_items table
            const fridgeID = 1;
            
            const foodItemQuery = `
                INSERT INTO food_items (
                    donorID,
                    name,
                    quantity,
                    expirationDate,
                    status,
                    fridgeID,
                    category,
                    created_at
                ) VALUES (?, ?, ?, ?, 'Available', ?, ?, NOW())
            `;
            
            const foodItemValues = [
                donorId,
                'Test Food Item',
                5,
                expiry,
                fridgeID,
                'Other'
            ];
            
            console.log('Executing food_items query with values:', foodItemValues);
            
            let foodItemResult;
            try {
                [foodItemResult] = await connection.execute(foodItemQuery, foodItemValues);
                console.log('Food item insert result:', foodItemResult);
            } catch (foodItemError) {
                console.error('Error executing food_items insert query:', foodItemError);
                throw new Error('Failed to insert food item: ' + foodItemError.message);
            }
            
            // Commit transaction
            await connection.commit();
            console.log('Transaction committed successfully');
            
            res.json({ 
                success: true, 
                message: 'Test donation added successfully',
                donationId: donationResult.insertId,
                foodItemId: foodItemResult.insertId
            });
            
        } catch (error) {
            // If any error occurred, roll back the transaction
            if (connection) {
                try {
                    await connection.rollback();
                    console.log('Transaction rolled back successfully');
                } catch (rollbackError) {
                    console.error('Error rolling back transaction:', rollbackError);
                }
            }
            throw error;
        } finally {
            // Always release the connection back to the pool
            if (connection) {
                connection.release();
                console.log('Database connection released');
            }
        }
    } catch (error) {
        console.error('Error in direct donation test:', error);
        res.status(500).json({ 
            error: 'An error occurred: ' + error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
