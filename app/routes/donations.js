// donations.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Create a new donation
router.post('/', async (req, res) => {
    console.log('==== DONATION POST ENDPOINT CALLED ====');
    console.log('Request body:', req.body);
    
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
        
        // Insert donation into database
        const query = `
            INSERT INTO donations (
                donor_id, 
                food_name, 
                quantity, 
                donation_date, 
                expiry_date, 
                notes
            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        console.log('Executing query with values:', [
            donor_id, 
            foodName, 
            quantity, 
            today, 
            expiration, 
            description || null
        ]);
        
        try {
            const result = await db.query(
                query, 
                [donor_id, foodName, quantity, today, expiration, description || null]
            );
            
            console.log('Database insert result:', result);
            
            if (result.affectedRows === 1) {
                console.log('Donation added successfully with ID:', result.insertId);
                res.status(201).json({ 
                    success: true, 
                    message: 'Donation added successfully',
                    donationId: result.insertId
                });
            } else {
                console.error('Failed to add donation - no affected rows');
                throw new Error('Failed to add donation - no affected rows');
            }
        } catch (dbError) {
            console.error('Database error during insert:', dbError);
            throw dbError;
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
        
        const query = `
            SELECT * FROM donations
            WHERE donor_id = ?
            ORDER BY donation_date DESC
        `;
        
        const donations = await db.query(query, [donorId]);
        console.log(`Retrieved ${donations.length} donations for donor ${donorId}`);
        res.json(donations);
    } catch (error) {
        console.error('Error fetching donor donations:', error);
        res.status(500).json({ error: 'An error occurred while fetching donor donations' });
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
