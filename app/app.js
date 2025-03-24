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
  // __dirname is the absolute path to the folder containing this file (app.js).
  // We move one level up to ../, then into frontend/, and serve the HTML file.
  res.sendFile(path.join(__dirname, "..", "frontend", "main.html"));
});
// Dynamic route for the "Donate Food" page
app.get("/donate", function(req, res) {
    res.sendFile(path.join(__dirname, "..", "frontend", "donor.html"));
  });
//Dynamic route for the "Receieve Food" page
app.get("/receive", function(req, res) {
    res.sendFile(path.join (__dirname, "..", "frontend", "recepient.html"));
});
//Dynamic route for the "volunteer" page
app.get("/volunteer", function(req, res) {
    res.sendFile(path.join (__dirname, "..", "frontend", "volunteer.html"));
});
//Dynamic route for the "login" page
app.get("/login", function(req, res) {
  res.sendFile(path.join (__dirname, "..", "frontend", "login.html"));
});
//Dynamic route for the "guidelines" page
app.get("/guidelines", function(req, res) {
  res.sendFile(path.join (__dirname, "..", "frontend", "guidelines.html"));
});
//Dynamic route for the "donationform" page
app.get("/donationform", function(req, res) {
  res.sendFile(path.join (__dirname, "..", "frontend", "donationform.html"));
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});