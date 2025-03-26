// models/Donation.js
const mongoose = require('mongoose');

// Define schema for the Donation collection
const donationSchema = new mongoose.Schema({
  foodName: String,
  category: String,
  quantity: Number,
  expiration: Date,
  description: String,
  donatedBy: String,
  donatedAt: { type: Date, default: Date.now }
});

// Create a model for the Donation schema
const Donation = mongoose.model('Donation', donationSchema);

// Export the Donation model
module.exports = Donation;
