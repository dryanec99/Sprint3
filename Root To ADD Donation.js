// Route to handle adding donations
app.post('/add-donation', (req, res) => {
  const { foodName, category, quantity, expiration, description, donatedBy } = req.body;

  const newDonation = new Donation({
    foodName,
    category,
    quantity,
    expiration,
    description,
    donatedBy
  });

  newDonation.save()
    .then(() => res.redirect('/donation-history'))  // Redirect to the donation history page after successful donation
    .catch(err => {
      console.error('Error saving donation:', err);
      res.status(500).send('Internal Server Error');  // Handle errors during donation submission
    });
});
