const mongoose = require('mongoose');

require('dotenv').config();

const connection =  mongoose.connect(process.env.mongourl);

module.exports = {
    connection
}
// async function connectToDatabase() {
//   try {
//     await mongoose.connect(process.env.mongourl, {
//         bufferCommands: false, // Disable buffering
//         bufferTimeoutMS: 30000,
//     });
//     console.log('Connected to MongoDB');
    
//     // Now you can execute queries
//     // Example:
//     // const user = await User.findOne({ username: 'example' });
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }

// connectToDatabase();
