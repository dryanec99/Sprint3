// Import express.js
const express = require("express");
// Get the functions in the db.js file to use
const db = require('./services/db');
// At the top of app.js, require 'path' for safer path handling
const path = require("path");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Create a route for root - /
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "main.html"));
});

// Dynamic routes for each page
app.get("/donate", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "donor.html"));
});
app.get("/receive", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "recepient.html"));
});
app.get("/volunteer", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "volunteer.html"));
});
app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "login.html"));
});
app.get("/donationguidelines", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "donationguidelines.html"));
});
app.get("/donationform", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "donationform.html"));
});
app.get("/donationhistory", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "donationhistory.html"));
});
app.get("/viewfood", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "viewfood.html"));
});
app.get("/reservefood", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "reservefood.html"));
});
app.get("/reservations", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "reservations.html"));
});
app.get("/manageinventory", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "manageinventory.html"));
});
app.get("/managereservations", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "managereservations.html"));
});
app.get("/sendnotifications", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "sendnotifications.html"));
});
app.get("/contact", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "contact.html"));
});
app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "about.html"));
});

// ✅ API route to get all food items
app.get("/api/food", async function (req, res) {
    try {
        const results = await db.query(`
            SELECT 
                f.name AS name,
                f.status AS status,
                f.quantity AS quantity,
                f.expirationDate AS expirationDate,
                fr.location AS location
            FROM food_items f
            JOIN fridges fr ON f.fridgeID = fr.fridgeID
            WHERE f.status = 'Available'
        `);
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to fetch food data" });
    }
});




// Start server on port 3000
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
