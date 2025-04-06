// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Path to JSON file
const inventoryPath = path.join(__dirname, 'inventory.json');

// Load inventory
const loadInventory = () => JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

// Save inventory
const saveInventory = (data) => fs.writeFileSync(inventoryPath, JSON.stringify(data, null, 2), 'utf8');

// Routes
app.get('/inventory', (req, res) => {
  res.json(loadInventory());
});

app.post('/inventory', (req, res) => {
  const inventory = loadInventory();
  inventory.push(req.body);
  saveInventory(inventory);
  res.status(201).send('Item added');
});

app.put('/inventory/:id', (req, res) => {
  const inventory = loadInventory();
  const itemIndex = inventory.findIndex(item => item.id === req.params.id);
  if (itemIndex !== -1) {
    inventory[itemIndex] = req.body;
    saveInventory(inventory);
    res.send('Item updated');
  } else {
    res.status(404).send('Item not found');
  }
});

app.delete('/inventory/:id', (req, res) => {
  let inventory = loadInventory();
  const filteredInventory = inventory.filter(item => item.id !== req.params.id);
  if (filteredInventory.length !== inventory.length) {
    saveInventory(filteredInventory);
    res.send('Item deleted');
  } else {
    res.status(404).send('Item not found');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// inventory.json (create this file in the same directory)
// []
