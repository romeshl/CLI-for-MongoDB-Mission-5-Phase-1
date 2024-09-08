import mongoose  from "mongoose"; // Import the mongoose package
import ListingsSchema from "../Schemas/ListingsSchema.js"; // Import the Listings schema

const Listings = mongoose.model("Listings", ListingsSchema); // Create a new mongoose model for the listings

export default Listings;