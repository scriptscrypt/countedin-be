const mongoose = require('mongoose');
require('dotenv').config();
const { ENV_DB_URL } = require('./secrets');

// Function to connect to the database
async function connectDB() {
  try {
    console.log('Connecting to the database...');
    await mongoose.connect(`${ENV_DB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

module.exports = connectDB;