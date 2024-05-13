const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Item = require('./src/models/item');  
const itemRoutes = require('./src/routes/itemRoutes');
const savedRoutes = require('./src/routes/savedRoutes'); 
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files from public directory

// MongoDB Compass connection
mongoose.connect('mongodb://localhost:27017/catalogue')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// Route handlers
app.use('/api/items', itemRoutes); 
app.use('/api', savedRoutes);

// Routes to serve the pages
app.get('/saved-items', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'savedItems.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
