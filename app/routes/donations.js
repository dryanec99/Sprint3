// donations.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Simple test endpoint
router.get('/test', async (req, res) => {
    console.log('==== DONATION TEST ENDPOINT CALLED ====');
    res.json({ success: true, message: 'Donation API is working' });
});

// Create a new donation
router.post('/', async (req, res) => {
    console.log('==== DONATION POST ENDPOINT CALLED ====');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    try {
        // Check if request body is empty
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Empty request body');
            return res.status(400).json({ error: 'Request body is empty' });
        }
        
        const { foodName, category, quantity, expiration, description, donor_id } = req.body;
        
        console.log('Extracted data:', { 
            foodName: foodName || 'MISSING', 
            category: category || 'MISSING', 
            quantity: quantity || 'MISSING', 
            expiration: expiration || 'MISSING', 
            description: description || 'MISSING',
            donor_id: donor_id || 'MISSING'
        });
        
        // Validate required fields
        if (!foodName || !quantity || !expiration || !donor_id) {
            console.error('Missing required fields');
            return res.status(400).json({ 
                error: 'Food name, quantity, expiration date, and donor ID are required',
                missing: {
                    foodName: !foodName,
                    quantity: !quantity,
                    expiration: !expiration,
                    donor_id: !donor_id
                }
            });
        }
        
        // Get current date for donation_date
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        console.log('Using donation date:', today);
        
        // Get a connection for transaction
        console.log('Getting database connection for transaction');
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
            console.log('Beginning transaction');
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
            
            console.log('Executing donation query with values:', [
                donor_id, 
                foodName, 
                quantity, 
                today, 
                expiration, 
                description || null
            ]);
            
            let donationResult;
            try {
                [donationResult] = await connection.execute(
                    donationQuery, 
                    [donor_id, foodName, quantity, today, expiration, description || null]
                );
                console.log('Donation insert result:', donationResult);
            } catch (donationError) {
                console.error('Error executing donation insert query:', donationError);
                throw new Error('Failed to insert donation: ' + donationError.message);
            }
            
            if (donationResult.affectedRows !== 1) {
                console.error('Failed to add donation - no affected rows');
                throw new Error('Failed to add donation - no affected rows');
            }
            
            // 2. Insert into food_items table
            // Get a fridge ID - for simplicity, using the first fridge (ID 1)
            // In a real app, you might want to select a fridge based on capacity or location
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
            
            console.log('Executing food_items query with values:', [
                donor_id,
                foodName,
                quantity,
                expiration,
                fridgeID,
                category || 'Other'
            ]);
            
            let foodItemResult;
            try {
                [foodItemResult] = await connection.execute(
                    foodItemQuery,
                    [donor_id, foodName, quantity, expiration, fridgeID, category || 'Other']
                );
                console.log('Food item insert result:', foodItemResult);
            } catch (foodItemError) {
                console.error('Error executing food_items insert query:', foodItemError);
                throw new Error('Failed to insert food item: ' + foodItemError.message);
            }
            
            if (foodItemResult.affectedRows !== 1) {
                console.error('Failed to add food item - no affected rows');
                throw new Error('Failed to add food item - no affected rows');
            }
            
            // If we got here, both inserts were successful
            console.log('Both inserts successful, committing transaction');
            await connection.commit();
            
            console.log('Transaction committed successfully');
            res.status(201).json({ 
                success: true, 
                message: 'Donation added successfully',
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
            console.error('Transaction rolled back due to error:', dbError);
            throw dbError;
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
        console.error('Error adding donation:', error);
        res.status(500).json({ 
            error: 'An error occurred while adding the donation: ' + error.message,
            stack: error.stack
        });
    }
});

// Get all donations
router.get('/', async (req, res) => {
    console.log('==== GET ALL DONATIONS ENDPOINT CALLED ====');
    try {
        const query = `
            SELECT d.*, u.name as donor_name
            FROM donations d
            JOIN users u ON d.donor_id = u.userID
            ORDER BY d.donation_date DESC
        `;
        
        const donations = await db.query(query);
        console.log(`Retrieved ${donations.length} donations`);
        res.json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ error: 'An error occurred while fetching donations' });
    }
});

// Get donations by donor ID
router.get('/donor/:id', async (req, res) => {
    console.log('==== GET DONOR DONATIONS ENDPOINT CALLED ====');
    console.log('Donor ID:', req.params.id);
    try {
        const donorId = req.params.id;
        
        // First query to get donations from the donations table
        const donationsQuery = `
            SELECT * FROM donations
            WHERE donor_id = ?
            ORDER BY donation_date DESC
        `;
        
        // Second query to get food items from the food_items table
        const foodItemsQuery = `
            SELECT f.*, fr.location as fridge_location 
            FROM food_items f
            LEFT JOIN fridges fr ON f.fridgeID = fr.fridgeID
            WHERE f.donorID = ?
            ORDER BY f.created_at DESC
        `;
        
        console.log('Executing donations query with donorId:', donorId);
        console.log('Donations query:', donationsQuery);
        
        console.log('Executing food items query with donorId:', donorId);
        console.log('Food items query:', foodItemsQuery);
        
        // Execute both queries
        let donations, foodItems;
        
        try {
            donations = await db.query(donationsQuery, [donorId]);
            console.log('Donations query result:', donations);
        } catch (donationsError) {
            console.error('Error executing donations query:', donationsError);
            throw new Error('Failed to fetch donations: ' + donationsError.message);
        }
        
        try {
            foodItems = await db.query(foodItemsQuery, [donorId]);
            console.log('Food items query result:', foodItems);
        } catch (foodItemsError) {
            console.error('Error executing food items query:', foodItemsError);
            throw new Error('Failed to fetch food items: ' + foodItemsError.message);
        }
        
        console.log(`Retrieved ${donations.length} donations and ${foodItems.length} food items for donor ${donorId}`);
        
        // Combine the results
        const result = {
            donations: donations,
            foodItems: foodItems
        };
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching donor donations:', error);
        res.status(500).json({ error: 'An error occurred while fetching donor donations: ' + error.message });
    }
});

// Get a specific donation by ID
router.get('/:id', async (req, res) => {
    console.log('==== GET DONATION BY ID ENDPOINT CALLED ====');
    console.log('Donation ID:', req.params.id);
    try {
        const donationId = req.params.id;
        
        const query = `
            SELECT d.*, u.name as donor_name
            FROM donations d
            JOIN users u ON d.donor_id = u.userID
            WHERE d.donation_id = ?
        `;
        
        const donations = await db.query(query, [donationId]);
        
        if (donations.length === 0) {
            console.log('Donation not found');
            return res.status(404).json({ error: 'Donation not found' });
        }
        
        console.log('Retrieved donation:', donations[0]);
        res.json(donations[0]);
    } catch (error) {
        console.error('Error fetching donation:', error);
        res.status(500).json({ error: 'An error occurred while fetching the donation' });
    }
});

module.exports = router;
