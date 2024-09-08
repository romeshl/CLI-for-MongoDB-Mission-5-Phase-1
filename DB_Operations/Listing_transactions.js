import Listings from "../Collections/ListingsCollection.js"; // Import the Listings model from the ListingsCollection file

// Add a new listing
export async function Add_Listing(data) {
  try {
    const Listing = await Listings.create(data);
    return Listing;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// Add seed data to the listings
export async function Add_Seed_Data(data) {
  try {
    const SeededListings = await Listings.insertMany(data);
    return SeededListings;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// Show all listings
export async function Show_Listings() {
  try {
    const listings = await Listings.find({});
    return listings;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// Delete a listing
export async function Delete_Listing(id) {
  try {
    const listing = await Listings.findByIdAndDelete(id);
    return listing;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// Delete all listings
export async function Delete_All_Listings() {
  // Delete all listings
  try {
    const listings = await Listings.deleteMany({});
    return listings;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// Show a listing
export async function Show_Listing(id) {
  // Show a listing
  try {
    const listing = await Listings.findById(id);
    return listing;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

// Update a listing
export async function Update_Listing(id, data) {
  try {
    const listing = await Listings.findByIdAndUpdate(id, data, { new: true }); // Return the updated listing
    return listing;
  } catch (err) {
    console.error(err.message);
    return null;
  }
}
