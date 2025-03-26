// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Donation = require('./models/Donation');  // Import the Donation model

const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB (replace 'mongodb://localhost/community_fridge' with your MongoDB URI)
mongoose.connect('mongodb://localhost/community_fridge', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Route to display the donation history
app.get('/donation-history', (req, res) => {
  // Fetch all donations from the database
  Donation.find()
    .sort({ donatedAt: -1 }) // Sort by donation date, most recent first
    .then(donations => {
      res.render('donation-history', { donations });  // Render the donation-history view and pass the donations
    })
    .catch(err => {
      console.error('Error fetching donations:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
