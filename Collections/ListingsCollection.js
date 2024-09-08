import mongoose  from "mongoose";
import ListingsSchema from "../Schemas/ListingsSchema.js";

const Listings = mongoose.model("Listings", ListingsSchema);

export default Listings;