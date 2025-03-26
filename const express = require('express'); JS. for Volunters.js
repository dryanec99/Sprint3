const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB (replace with your database credentials)
mongoose.connect('mongodb://localhost/volunteer-system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));

// Volunteer Schema
const volunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  availability: String
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// Routes

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Volunteer Registration page
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle volunteer registration
app.post('/register', (req, res) => {
  const { name, email, phone, availability } = req.body;

  const newVolunteer = new Volunteer({
    name,
    email,
    phone,
    availability
  });

  newVolunteer.save()
    .then(() => {
      res.redirect('/volunteers');
    })
    .catch(err => {
      res.status(500).send('Error registering volunteer.');
    });
});

// View all volunteers
app.get('/volunteers', (req, res) => {
  Volunteer.find()
    .then(volunteers => {
      res.render('volunteers', { volunteers });
    })
    .catch(err => {
      res.status(500).send('Error retrieving volunteers.');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Connect to MongoDB (replace with your database credentials)
mongoose.connect('mongodb://localhost/volunteer-system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));

// Volunteer Schema
const volunteerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  availability: String
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// Routes

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Volunteer Registration page
app.get('/register', (req, res) => {
  res.render('register');
});

// Handle volunteer registration
app.post('/register', (req, res) => {
  const { name, email, phone, availability } = req.body;

  const newVolunteer = new Volunteer({
    name,
    email,
    phone,
    availability
  });

  newVolunteer.save()
    .then(() => {
      res.redirect('/volunteers');
    })
    .catch(err => {
      res.status(500).send('Error registering volunteer.');
    });
});

// View all volunteers
app.get('/volunteers', (req, res) => {
  Volunteer.find()
    .then(volunteers => {
      res.render('volunteers', { volunteers });
    })
    .catch(err => {
      res.status(500).send('Error retrieving volunteers.');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
