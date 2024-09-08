import connectDB from './Connection/MongoDB.js';
import Listings from './Collections/ListingsCollection.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB();


async function run(data) {
    const Listing = await Listings.create(data);
    console.log(Listing);
}

run({
  title: "My first listing",
  description: "This is my first listing",
  start_price: 10,
  reserve_price: 20,
});