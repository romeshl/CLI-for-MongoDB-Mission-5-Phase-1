import Listings from "../Collections/ListingsCollection.js"; // Import the Listings model from the ListingsCollection file
//import Seed_Data from './trademe.listings.json' assert { type: "json"}; // Import the Seed Data from the trademe.listings.json file

//Code for testing mongoose
// import connectDB from "./Connection/MongoDB.js";
// import dotenv from "dotenv";
// dotenv.config();
// const db = await connectDB();

export async function Add_Listing(data) {
  // Add a new listing
  const Listing = await Listings.create(data);
  return Listing;
}

export async function Add_Seed_Data(data) {
  const SeededListings = await Listings.insertMany(data);
  return SeededListings;
}

export async function Show_Listings() {
  // Show all listings
  try {
    const listings = await Listings.find({});
    return listings;
  } catch (err) {
    console.error(err.message);
  }
}

export async function Delete_Listing(id) {
  // Delete a listing
  try {
    const listing = await Listings.findByIdAndDelete(id);
    return listing;
  } catch (err) {
    //console.error(err.message);
    return null;
  }
}

export async function Delete_All_Listings() {
  // Delete all listings
  try {
    const listings = await Listings.deleteMany({});
    return listings;
  } catch (err) {
    console.error(err.message);
  }
}

export async function Show_Listing(id) {
  // Show a listing
  try {
    const listing = await Listings.findById(id);
    return listing;
  } catch (err) {
    return null;
  }
}

export async function Update_Listing(id, data) {
  // Update a listing
  try {
    const listing = await Listings.findByIdAndUpdate(id, data, { new: true }); // Return the updated listing
    return listing;
  } catch (err) {
    return null;
  }
}

// Code for testing mongoose
// Add_Listing({ title: "Test", description: "Test description", start_price: 5, reserve_price: 10 }).then((listing) => {
//     console.log(listing);
// });

//console.log( await Show_Listings());

//console.log( await Add_Seed_Data(Seed_Data));

//console.log(await Delete_Listing("66dd2d411ff66e40f9ac25cf"));
//console.log(await Delete_All_Listings());
//console.log(await Show_Listing("66dd309d4484df92762903b4"));
//console.log(await Update_Listing("66dd309d4484df92762903b4", { title: "Test", description: "Test description", start_price: 5, reserve_price: 10 }));
