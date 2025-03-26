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
