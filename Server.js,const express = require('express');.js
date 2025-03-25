const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// In-memory array to store notifications (can be replaced with a database)
let notifications = [];

// Route to serve the page (assuming your HTML is served as a static file)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Adjust the path as needed
});

// Route to handle the form submission (POST)
app.post('/sendNotificationProcess.php', (req, res) => {
  const { subject, message, audience } = req.body;

  // Basic validation (ensure all fields are provided)
  if (!subject || !message || !audience) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  // Create a new notification
  const newNotification = { subject, message, audience, dateSent: new Date() };

  // Store the notification (can be replaced with a database call)
  notifications.push(newNotification);

  // Respond with success
  res.json({ success: true, message: "Notification sent successfully!" });
});

// Route to get all notifications (for testing or administrative purposes)
app.get('/notifications', (req, res) => {
  res.json(notifications);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
