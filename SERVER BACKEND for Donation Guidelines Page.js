// Importing required modules
const express = require('express');
const path = require('path');

// Create an instance of the express app
const app = express();

// Define the port number where the app will run
const port = 3000;

// Serve the public folder for static files (HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Route for the Donation Guidelines page
app.get('/donation-guidelines', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'donation_guidelines.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
