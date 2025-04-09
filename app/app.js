// Import express.js
const express = require("express");
// Get the functions in the db.js file to use
const db = require('./services/db');
// At the top of app.js, require 'path' for safer path handling
const path = require("path");

// Import route files
const reserveFoodRoutes = require('./routes/reservefood');
const manageInventoryRoutes = require('./routes/manageinventory');
const manageReservationsRoutes = require('./routes/managereservations');
const sendNotificationsRoutes = require('./routes/sendnotifications');
const volunteerRoutes = require('./routes/volunteer');
const reservationRoutes = require('./routes/reservation');
const recipientRoutes = require('./routes/recipient');
const viewFoodRoutes = require('./routes/viewfood');
const authRoutes = require('./routes/auth');
const donationsRoutes = require('./routes/donations');

// Create express app
var app = express();

// Add middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add static files location
app.use(express.static("static"));

// Use route files
app.use('/api/reserve-food', reserveFoodRoutes);
app.use('/api/inventory', manageInventoryRoutes);
app.use('/api/manage-reservations', manageReservationsRoutes);
app.use('/api/notifications', sendNotificationsRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/recipient', recipientRoutes);
app.use('/api/food', viewFoodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationsRoutes);

// Create a route for root - /
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "main.html"));
});

// Test signup page
app.get("/test-signup", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "test-signup.html"));
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

// Start server on port 3000
app.listen(3000, function() {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
