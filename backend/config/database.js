// backend/config/database.js

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

/**
 * Connect to MongoDB
 */
const connectDatabase = async () => {
  const uri = process.env.DB_LOCAL_URI || process.env.DB_URI;

  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);

    // Retry connection attempt after 5 seconds
    setTimeout(connectDatabase, 5000);
  }
};

module.exports = connectDatabase;
