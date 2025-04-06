const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/community_fridge', { useNewUrlParser: true, useUnifiedTopology: true });

const notificationSchema = new mongoose.Schema({
  subject: String,
  message: String,
  audience: String,
  dateSent: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);

// Save notification to MongoDB instead of in-memory array
const newNotification = new Notification({ subject, message, audience });
newNotification.save()
  .then(() => res.json({ success: true, message: "Notification sent successfully!" }))
  .catch(err => res.status(500).json({ success: false, error: "Database error: " + err.message }));
