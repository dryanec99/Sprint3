// auth.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

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
        
        const query = `
            SELECT userID, name, email, role 
            FROM users 
            WHERE email = ? AND password = ?
        `;
        
        const results = await db.query(query, [email, password]);
        
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Return user data (excluding password)
        const user = results[0];
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

// Register route
router.post('/register', async (req, res) => {
    console.log('==== REGISTER ROUTE CALLED ====');
    console.log('Request body:', req.body);
    
    try {
        // Check if the request body is empty
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Empty request body');
            return res.status(400).json({ error: 'Request body is empty' });
        }
        
        // Extract the basic user data
        const { name, email, password, role, typeOfUser } = req.body;
        
        console.log('Extracted data:', { 
            name: name || 'MISSING', 
            email: email || 'MISSING', 
            password: password ? '***' : 'MISSING', 
            role: role || 'MISSING',
            typeOfUser: typeOfUser || 'MISSING'
        });
        
        // Validate required fields
        if (!name || !email || !password || !role) {
            console.error('Missing required fields');
            return res.status(400).json({ 
                error: 'Name, email, password, and role are required',
                missing: {
                    name: !name,
                    email: !email,
                    password: !password,
                    role: !role
                }
            });
        }
        
        // Validate role against the enum values in the database
        const validRoles = ['Donor', 'Recipient', 'Volunteer', 'Admin'];
        if (!validRoles.includes(role)) {
            console.error('Invalid role:', role);
            return res.status(400).json({ 
                error: 'Role must be one of: Donor, Recipient, Volunteer, Admin' 
            });
        }
        
        // Check if email already exists
        const checkQuery = 'SELECT userID FROM users WHERE email = ?';
        console.log('Checking if email exists:', email);
        const existingUser = await db.query(checkQuery, [email]);
        
        if (existingUser.length > 0) {
            console.error('Email already exists');
            return res.status(409).json({ error: 'Email already registered' });
        }
        
        // Use typeOfUser from request or default to role
        const userType = typeOfUser || role;
        console.log('Using typeOfUser:', userType);
        
        // Insert new user with typeOfUser field
        const insertQuery = `
            INSERT INTO users (name, email, password, role, typeOfUser) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        console.log('Executing insert query with values:', [name, email, '***', role, userType]);
        
        try {
            const result = await db.query(insertQuery, [name, email, password, role, userType]);
            console.log('Insert result:', result);
            
            if (result && result.affectedRows === 1) {
                console.log('User registered successfully with ID:', result.insertId);
                
                // If it's a volunteer, try to store additional information
                if (role === 'Volunteer' && result.insertId) {
                    try {
                        const whyVolunteer = req.body.whyVolunteer || '';
                        const availability = req.body.availability || '';
                        const skills = req.body.skills || '';
                        
                        // Check if volunteer_details table exists first
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
                        // Continue with registration even if volunteer details fail
                    }
                }
                
                // Get the newly created user
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
                    res.status(201).json({ 
                        success: true, 
                        message: 'Registration successful',
                        userId: result.insertId
                    });
                }
            } else {
                console.error('Failed to register user - no affected rows');
                throw new Error('Failed to register user - no affected rows');
            }
        } catch (dbError) {
            console.error('Database error during insert:', dbError);
            throw dbError;
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
