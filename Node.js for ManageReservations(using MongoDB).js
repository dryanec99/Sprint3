// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fridgeInventory', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define Schema and Model
const inventorySchema = new mongoose.Schema({
  itemName: String,
  category: String,
  quantity: String,
  expirationDate: String
});

const Inventory = mongoose.model('Inventory', inventorySchema);

// Routes
// GET route to fetch all inventory items
app.get('/inventory', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST route to add a new inventory item
app.post('/inventory', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).send('Item added');
  } catch (err) {
    res.status(400).send('Bad request');
  }
});

// PUT route to update an existing inventory item
app.put('/inventory/:id', async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedItem) {
      res.send('Item updated');
    } else {
      res.status(404).send('Item not found');
    }
  } catch
