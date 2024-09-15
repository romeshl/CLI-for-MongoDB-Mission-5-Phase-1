import mongoose from "mongoose"; // Import the mongoose package

const listingSchema = new mongoose.Schema(
	{
		// Create a new mongoose schema for the listings
		title: { type: String, required: true },
		description: {
			type: String,
			required: true,
		},
		start_price: { type: Number, required: true },
		reserve_price: { type: Number, required: true },
	},
	{ strict: true }
);

export default listingSchema;
