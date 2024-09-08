import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    start_price: Number,
    reserve_price: Number,
});

export default listingSchema;