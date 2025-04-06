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
app.get('/inventory', async (req, res) => {
  const items = await Inventory.find();
  res.json(items);
});

app.post('/inventory', async (req, res) => {
  const newItem = new Inventory(req.body);
  await newItem.save();
  res.status(201).send('Item added');
});

app.put('/inventory/:id', async (req, res) => {
  const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updatedItem) {
    res.send('Item updated');
  } else {
    res.status(404).send('Item not found');
  }
});

app.delete('/inventory/:id', async (req, res) => {
  const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
  if (deletedItem) {
    res.send('Item deleted');
  } else {
    res.status(404).send('Item not found');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
