const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/onepiece', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use the routes
app.use('/api', routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

