const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware to parse POST data (from the form)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static HTML files (like the one you provided)
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle the form submission
app.post('/reserveFoodProcess.php', (req, res) => {
  // Get the form data sent from the client
  const { foodItem, quantity, pickupDate, pickupLocation, contactInfo, additionalNotes } = req.body;

  // You can process the reservation data here (e.g., save to a database, log it, etc.)
  console.log('New Reservation:', {
    foodItem,
    quantity,
    pickupDate,
    pickupLocation,
    contactInfo,
    additionalNotes,
  });

  // You can respond with a success message
  res.send(`
    <h1>Reservation Confirmed</h1>
    <p>Thank you for your reservation! Here's a summary of your reservation:</p>
    <ul>
      <li><strong>Food Item:</strong> ${foodItem}</li>
      <li><strong>Quantity:</strong> ${quantity}</li>
      <li><strong>Pickup Date:</strong> ${pickupDate}</li>
      <li><strong>Pickup Location:</strong> ${pickupLocation}</li>
      <li><strong>Contact Info:</strong> ${contactInfo}</li>
      <li><strong>Additional Notes:</strong> ${additionalNotes || 'None'}</li>
    </ul>
    <p>We will get in touch with you soon!</p>
    <p><a href="/">Go back to reservation page</a></p>
  `);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
