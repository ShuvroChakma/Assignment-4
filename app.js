const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const config = require('./app/config/config');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Import routes
const apiRoutes = require('./app/routes/api');

// Use routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));