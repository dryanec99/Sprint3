notifications.push(newNotification);
notifications.push(newNotification);
app.get('/notifications', (req, res) => {
    res.json(notifications);
  });
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
// staring the server  