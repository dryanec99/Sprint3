// auth.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');
// At the top of the file, require bcrypt:
const bcrypt = require('bcryptjs');
const saltRounds = 10;  // You can adjust the number of rounds for salt generation

// Debug route to check table structure
router.get('/debug/table-structure', async (req, res) => {
    try {
        const query = `
            DESCRIBE users
        `;
        
        const results = await db.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error checking table structure:', error);
        res.status(500).json({ error: 'An error occurred while checking table structure' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Query the database by email only
        const query = `
            SELECT userID, name, email, password, role 
            FROM users 
            WHERE email = ?
        `;
        const results = await db.query(query, [email]);
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = results[0];
        
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Return user data (excluding the password)
        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user.userID,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});


// Inside your register route:
router.post('/register', async (req, res) => {
    console.log('==== REGISTER ROUTE CALLED ====');
    console.log('Request body:', req.body);
    
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Empty request body');
            return res.status(400).json({ error: 'Request body is empty' });
        }
        
        // Extract user data
        const { name, email, password, role, typeOfUser } = req.body;
        
        console.log('Extracted data:', { 
            name: name || 'MISSING', 
            email: email || 'MISSING', 
            password: password ? '***' : 'MISSING', 
            role: role || 'MISSING',
            typeOfUser: typeOfUser || 'MISSING'
        });
        
        if (!name || !email || !password || !role) {
            console.error('Missing required fields');
            return res.status(400).json({ 
                error: 'Name, email, password, and role are required',
                missing: { name: !name, email: !email, password: !password, role: !role }
            });
        }
        
        const validRoles = ['Donor', 'Recipient', 'Volunteer', 'Admin'];
        if (!validRoles.includes(role)) {
            console.error('Invalid role:', role);
            return res.status(400).json({ error: 'Role must be one of: Donor, Recipient, Volunteer, Admin' });
        }
        
        // Check if email already exists
        const checkQuery = 'SELECT userID FROM users WHERE email = ?';
        console.log('Checking if email exists:', email);
        const existingUser = await db.query(checkQuery, [email]);
        if (existingUser.length > 0) {
            console.error('Email already exists');
            return res.status(409).json({ error: 'Email already registered' });
        }
        
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Use typeOfUser from request or default to role
        const userType = typeOfUser || role;
        console.log('Using typeOfUser:', userType);
        
        // Insert new user using the hashed password
        const insertQuery = `
            INSERT INTO users (name, email, password, role, typeOfUser) 
            VALUES (?, ?, ?, ?, ?)
        `;
        console.log('Executing insert query with values:', [name, email, '***', role, userType]);
        
        const result = await db.query(insertQuery, [name, email, hashedPassword, role, userType]);
        console.log('Insert result:', result);
        
        if (result && result.affectedRows === 1) {
            console.log('User registered successfully with ID:', result.insertId);
            
            // Handle volunteer-specific details if applicable
            if (role === 'Volunteer' && result.insertId) {
                try {
                    const whyVolunteer = req.body.whyVolunteer || '';
                    const availability = req.body.availability || '';
                    const skills = req.body.skills || '';
                    const checkTableQuery = `
                        SELECT COUNT(*) as tableExists 
                        FROM information_schema.tables 
                        WHERE table_schema = 'community_fridge' 
                        AND table_name = 'volunteer_details'
                    `;
                    const tableCheck = await db.query(checkTableQuery);
                    
                    if (tableCheck[0].tableExists > 0) {
                        const volunteerQuery = `
                            INSERT INTO volunteer_details (volunteerID, whyVolunteer, availability, skills)
                            VALUES (?, ?, ?, ?)
                        `;
                        await db.query(volunteerQuery, [result.insertId, whyVolunteer, availability, skills]);
                        console.log('Volunteer details saved');
                    } else {
                        console.log('volunteer_details table does not exist, skipping additional data');
                    }
                } catch (volunteerError) {
                    console.error('Error saving volunteer details:', volunteerError);
                }
            }
            
            // Return the newly created user (without password)
            const newUserQuery = 'SELECT userID, name, email, role FROM users WHERE userID = ?';
            const newUser = await db.query(newUserQuery, [result.insertId]);
            if (newUser.length > 0) {
                console.log('Sending success response with user data');
                res.status(201).json({ 
                    success: true, 
                    message: 'Registration successful',
                    user: {
                        id: newUser[0].userID,
                        name: newUser[0].name,
                        email: newUser[0].email,
                        role: newUser[0].role
                    }
                });
            } else {
                console.log('Sending success response with user ID only');
                res.status(201).json({ success: true, message: 'Registration successful', userId: result.insertId });
            }
        } else {
            console.error('Failed to register user - no affected rows');
            throw new Error('Failed to register user - no affected rows');
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'An error occurred during registration: ' + error.message,
            stack: error.stack
        });
    }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT userID, name, email, role, created_at
            FROM users
            WHERE userID = ?
        `;
        
        const results = await db.query(query, [id]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'An error occurred while fetching profile' });
    }
});

module.exports = router;
