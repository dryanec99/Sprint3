const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/loginProcess', (req, res) => {
  const { username, password } = req.body;
  console.log('Login Attempt:', { username, password });
  // Implement login logic here
  res.send('Login Successful');
});

app.post('/signupProcess', (req, res) => {
  const { email, newUsername, newPassword } = req.body;
  console.log('Signup Attempt:', { email, newUsername, newPassword });
  // Implement signup logic here
  res.send('Signup Successful');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
