const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log a confirmation message
    console.log(`MongoDB Connected: ${conn.connection.host} 🔌`);
  } catch (error) {
    // If an error occurs, log the error and exit the process
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
};

// Export the function so we can use it in other files
module.exports = connectDB;