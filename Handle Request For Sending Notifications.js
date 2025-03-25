app.use(express.json()); // Ensure JSON parsing middleware is enabled

app.post('/sendNotificationProcess.php', (req, res) => {
  const { subject, message, audience } = req.body;

  // Validate input
  if (!subject || !message || !audience) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Logic to send notification (e.g., email, SMS, etc.)
    // Example: sendNotification(subject, message, audience);

    res.status(200).json({ success: true, message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
  //start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  
});