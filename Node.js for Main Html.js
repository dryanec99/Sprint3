// Import required modules
const express = require('express');
const path = require('path');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like images, CSS, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
