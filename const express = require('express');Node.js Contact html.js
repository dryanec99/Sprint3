const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // To handle form data
const app = express();
const port = 3000;

// Middleware to parse URL-encoded data (form submissions)
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the Contact Us page (contact.html)
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Route to handle form submission
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Here you would typically send the form data to a database or an email service
  console.log(`Received contact form submission from ${name} (${email}):`);
  console.log(`Message: ${message}`);

  // Send a response (thank you message)
  res.send('<h1>Thank you for contacting us!</h1><p>We will get back to you shortly.</p>');
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Community Fridge!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
