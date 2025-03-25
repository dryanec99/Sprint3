const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Routes for different sections
app.get('/viewfood', (req, res) => {
  res.send('Here is the list of available food...');
  // You can add logic here to show the actual food available.
});

app.get('/reservefood', (req, res) => {
  res.send('You can reserve food here...');
  // You can add logic here to allow a recipient to reserve food.
});

app.get('/reservations', (req, res) => {
  res.send('Here are your current reservations...');
  // You can add logic here to show all the current reservations.
});

// Serve the HTML page when accessing the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
