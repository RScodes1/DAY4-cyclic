const mongoose = require('mongoose');

require('dotenv').config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.mongourl, {
         bufferCommands : false
    });
    console.log('Connected to MongoDB');
    
    // Now you can execute queries
    // Example:
    // const user = await User.findOne({ username: 'example' });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();
