const mongoose = require('mongoose');

require('dotenv').config()
 
const connection = mongoose.connect(process.env.mongourl, {
    bufferCommands: false, // Disable buffering
    // buffertimeoutms: 30000, // Increase timeout to 30 seconds
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  

 
module.exports = {
    connection
}