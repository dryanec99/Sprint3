// models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  foodName: String,
  category: String,
  quantity: Number,
  expiration: Date,
  description: String,
  donatedBy: String,
  donatedAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
