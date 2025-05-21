require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Define Point Schema
const pointSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  count: Number,
  timestamp: { type: Date, default: Date.now }
});

const Point = mongoose.model('Point', pointSchema);

// API routes
app.post('/api/points', async (req, res) => {
  try {
    const point = new Point({
      ...req.body,
      timestamp: new Date()
    });
    await point.save();
    res.status(201).send('Point saved');
  } catch (error) {
    console.error('Error saving point:', error);
    res.status(500).send(error.message);
  }
});

app.get('/api/points', async (req, res) => {
  try {
    const points = await Point.find();
    res.json(points);
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).send(error.message);
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
