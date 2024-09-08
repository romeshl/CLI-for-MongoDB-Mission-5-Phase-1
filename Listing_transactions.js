
import Listings from './Collections/ListingsCollection.js'; // Import the Listings model from the ListingsCollection file

// Code for testing mongoose
// import connectDB from "./Connection/MongoDB.js";
// import dotenv from "dotenv";
// dotenv.config();
// const db = await connectDB();


export async function Add_Listing(data) { // Add a new listing
    const Listing = await Listings.create(data);
    return Listing;
}

export async function Show_Listings() { // Show all listings
    try {
        const listings = await Listings.find({});
        return listings;
    } catch (err) {
        console.error(err.message);
    }
}

// Code for testing mongoose
// Add_Listing({ title: "Test", description: "Test description", start_price: 5, reserve_price: 10 }).then((listing) => {
//     console.log(listing);
// });

//console.log( await Show_Listings());


