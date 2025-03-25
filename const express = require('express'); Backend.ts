const express = require('express');
const app = express();
const port = 3000;

let availableFood = [
  { item: 'Fresh Apples', category: 'Fruits', quantity: '20 kg', expirationDate: '2025-03-15', location: 'Downtown Community Fridge' },
  { item: 'Organic Carrots', category: 'Vegetables', quantity: '15 kg', expirationDate: '2025-03-20', location: 'Eastside Community Fridge' },
  { item: 'Canned Beans', category: 'Canned Goods', quantity: '50 cans', expirationDate: '2026-01-10', location: 'Westside Community Fridge' }
];

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Route to render the homepage
app.get('/', (req, res) => {
  res.render('index', { availableFood });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
