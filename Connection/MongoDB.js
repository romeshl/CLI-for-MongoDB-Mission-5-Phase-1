import mongoose from "mongoose"; // Import the mongoose package

const connectToDatabase = async () => { // Function to connect to the MongoDB database
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
      console.log("Connected to MongoDB");
      return mongoose;
  } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
      return false;
  }
};

export default connectToDatabase;
