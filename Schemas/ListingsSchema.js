import mongoose from 'mongoose'; // Import the mongoose package

const listingSchema = new mongoose.Schema({ // Create a new mongoose schema for the listings
    title: String, 
    description: String,
    start_price: Number,
    reserve_price: Number,
});

export default listingSchema;