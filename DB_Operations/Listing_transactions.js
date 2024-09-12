import Listings from "../Collections/ListingsCollection.js"; // Import the Listings model from the ListingsCollection file

// Adds a new listing
export async function Add_Listing(data) {
	try {
		const Listing = await Listings.create(data);
		return Listing;
	} catch (err) {
		throw new Error(err.message);
	}
}

// Add seed data to the listings
export async function Add_Seed_Data(data) {
	try {
		const SeededListings = await Listings.insertMany(data);
		return SeededListings;
	} catch (err) {
		throw new Error(err.message);
	}
}

// Show a listing
export async function Show_Listing(id) {
	// Show a listing
	try {
		const listing = await Listings.findById(id);
		if (listing === null) {
			throw new Error("Listing not found in the collection.");
		}
		return listing;
	} catch (err) {
		let errorMessage = "";
		if (err.message.includes("Cast to ObjectId failed")) {
			errorMessage = "Invalid ID format.";
		} else {
			errorMessage = err.message;
		}
		throw new Error(errorMessage);
	}
}

// Show all listings
export async function Show_Listings() {
	try {
		const listings = await Listings.find({});
		return listings;
	} catch (err) {
		throw new Error(err.message);
	}
}

// Update a listing
export async function Update_Listing(id, data) {
	try {
		const listing = await Listings.findByIdAndUpdate(id, data, {
			new: true,
		}); // Return the updated listing
		if (listing === null) {
			throw new Error(
				"Listing to be updated not found in the collection."
			);
		}
		return listing;
	} catch (err) {
		let errorMessage = "";
		if (err.message.includes("Cast to ObjectId failed")) {
			errorMessage = "Invalid ID format.";
		} else {
			errorMessage = err.message;
		}
		throw new Error(errorMessage);
	}
}

// Delete a listing
export async function Delete_Listing(id) {
	try {
		const listing = await Listings.findByIdAndDelete(id);
		if (listing === null) {
			throw new Error(
				"Listing to be deleted not found in the collection."
			);
		}
		return listing;
	} catch (err) {
		let errorMessage = "";
		if (err.message.includes("Cast to ObjectId failed")) {
			errorMessage = "Invalid ID format.";
		} else {
			errorMessage = err.message;
		}
		throw new Error(errorMessage);
	}
}

// Delete all listings
export async function Delete_All_Listings() {
	// Delete all listings
	try {
		const listings = await Listings.deleteMany({});
		return listings;
	} catch (err) {
		throw new Error(err.message);
	}
}
