#!/usr/bin/env node
// Shebang line to run the script as a command line tool (to run without typing Node)

import connectDB from "./Connection/MongoDB.js"; // Import the mongoose connection for the database
import {
  Add_Listing,
  Add_Seed_Data,
  Show_Listing,
  Show_Listings,
  Update_Listing,
  Delete_Listing,
  Delete_All_Listings,
} from "./Listing_transactions.js"; // Import the functions to perform CRUD operations on the listings

import { readFile } from "fs/promises"; // Import the fs package to read files
const Seed_Data = JSON.parse(
  await readFile(new URL("./Seed_Data/trademe.listings.json", import.meta.url))
); // Read the Seed Data from the trademe.listings.json file

import inquirer from "inquirer"; // Import the inquirer package for the CLI
import chalk from "chalk"; // Import the chalk package for colored text

import dotenv from "dotenv"; // Import the dotenv package to read the .env file
dotenv.config(); // Load the environment variables

const db = await connectDB(); // Connect to the MongoDB database

let Seed_Data_Added = false; // Variable to check if seed data has been added by running "Add seed data" option

function removeColor(text) {
  // Function to remove color attributes from text
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

// Function to detect "ESC" key press and exit to the terminal
const detectEscAndExit = () => {
  process.stdin.setRawMode(true); // Enable raw mode to detect keypress
  process.stdin.resume(); // Resume the stdin stream
  process.stdin.on("data", (key) => {
    if (key.toString() === "\u001b") {
      // Detect "ESC" key (ASCII code 27)
      console.log(chalk.redBright("\nESC detected. Exiting..."));
      db.connection.close(); // Close the MongoDB connection
      process.exit(); // Exit the process and return to the terminal
    }
  });
};

const options = [
  // Main menu options for the CLI
  {
    type: "list",
    name: "command",
    message: chalk.bold(chalk.greenBright("Choose an option:\n")), // Main menu
    choices: [
      chalk.blueBright("Add listing"), // Adds a new listing
      chalk.blueBright("Add seed data"), // Adds seed data to the listings
      chalk.yellowBright("Show listing"), // Shows all listings
      chalk.yellowBright("Show listings"), // Shows all listings
      chalk.greenBright("Update listing"), // Updates a listing
      chalk.magentaBright("Delete listing"), // Deletes a listing
      chalk.magentaBright("Delete all listings"), // Deletes all listings
      chalk.redBright("Exit"), // Exits the CLI to the terminal
    ],
  },
];

const questions = [
  // data to be added to the listings
  {
    type: "input", // inquirer input type
    name: "title", // name of the input
    message: "Enter the title of the listing item: ", // prompt message
    filter: (value) => {
      return value.trim(); // Remove whitespace
    },
  },
  {
    type: "input",
    name: "description",
    message: "Enter the description of the listing item: ",
    filter: (value) => {
      return value.trim(); // Remove whitespace
    },
  },
  {
    type: "input",
    name: "start_price",
    message: "Enter the start price of the listing: ",
    validate: function (value) {
      // Validate the input to check if it is a number and greater than 0
      if (isNaN(value) || parseInt(value) < 1 || value === "") {
        return "Please enter a valid number.";
      }
      return true;
    },
    filter: function (value) {
      return parseFloat(value); // Convert input to float
    },
  },
  {
    type: "input",
    name: "reserve_price",
    message: "Enter the reserve price of the listing: ",
    validate: function (value) {
      // Validate the input to check if it is a number and greater than 0
      if (isNaN(value) || value < 0 || value === "") {
        return "Please enter a valid number.";
      }
      return true;
    },
    filter: function (value) {
      return parseFloat(value); // Convert input to float
    },
  },
];

const runCLI = async () => {
  // Main function to run the CLI

  let keepRunning = true; // Variable to keep the CLI running

  detectEscAndExit(); // Start listening for ESC presses and exit if it's pressed

  if (!db) {
    // Check if the database connection was unsuccessful
    console.log(chalk.redBright("Unable to connect to MongoDB. Exiting..."));
    process.exit(); // Exit to the terminal
  }

  console.clear(); // Clear the console
  console.log(chalk.yellowBright(chalk.bold("Welcome to the CLI!"))); // Welcome message
  console.log(chalk.yellowBright(chalk.bold("===================\n")));
  console.log(chalk.gray("Press 'ESC' to exit at any time.\n\n")); // Exit message

  while (keepRunning) {
    // Loop to keep the CLI running

    const { command } = await inquirer.prompt(options); // Display main menu options and wait for user input

    // checks if user selected exit and exits the CLI
    if (removeColor(command) === "Exit") {
      console.log(chalk.red("\n\n\nGoodbye!\n\n\n"));
      db.connection.close(); // Close the MongoDB connection
      keepRunning = false; // Stop the loop and exit the CLI
    }

    // checks if user selected add data and prompts the user for data
    if (removeColor(command) === "Add listing") {
      const answers = await inquirer.prompt(questions);
      console.log("\n"); // Add a new line for spacing
      const addedListing = await Add_Listing(answers); // Add data to the listing
      console.log(addedListing); // Display the added listing data
      console.log("\n"); // Add a new line for spacing
      console.log(chalk.yellowBright("Listing added successfully!\n")); // Display success message
    }

    // checks if seed data has already been added once
    if (removeColor(command) === "Add seed data") {
      if (Seed_Data_Added) {
        console.log(
          chalk.yellowBright("\nSeed data has already been added.\n\n")
        );
        continue; // Skip adding seed data
      }
      const addedListing = await Add_Seed_Data(Seed_Data); // Add data to the listing
      console.log("\n"); // Add a new line for spacing
      console.log(addedListing); // Display the added listing data
      console.log("\n"); // Add a new line for spacing
      console.log(chalk.yellowBright("Seed data added successfully!\n")); // Display success message
      Seed_Data_Added = true; // Set the seed data added
    }

    // checks if user selected show listing and prompts the user for the listing id
    if (removeColor(command) === "Show listing") {
      const { id } = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter the ID of the listing item to show: ",
        filter: (value) => {
          return value.trim(); // Remove whitespace
        },
      });
      console.log("\n"); // Add a new line for spacing
      const showListing = await Show_Listing(id); // Show the listing
      if (!showListing) {
        // If the listing is not found, display an error message
        console.log(chalk.redBright("\nListing not found.\n"));
        continue; // Skip showing the listing
      }
      console.log("\n"); // Add a new line for spacing
      console.log(showListing); // Display the listing data
      console.log("\n"); // Add a new line for spacing
    }

    // checks if user selected show listings and displays all the listings
    if (removeColor(command) === "Show listings") {
      console.log("\n"); // Add a new line for spacing
      const showListings = await Show_Listings(); // Grabs all the listings from the collection
      console.log(showListings); // Display all the listings
      console.log("\n"); // Add a new line for spacing
      console.log(chalk.yellowBright("No. of listings: "), showListings.length); // Display the number of listings  in the collection
      console.log("\n"); // Add a new line for spacing
    }

    // checks if user selected update listing and prompts the user for the listing id
    if (removeColor(command) === "Update listing") {
      const { id } = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter the ID of the listing item to update: ",
        filter: (value) => {
          return value.trim(); // Remove whitespace
        },
      });
      const showListing = await Show_Listing(id); // Show the listing
      if (!showListing) {
        // If the listing is not found, display an error message
        console.log(chalk.redBright("\nListing not found.\n"));
        continue; // Skip showing the listing
      }
      console.log("\nListing to be updated:\n"); // Display the listing to be updated
      console.log(showListing); // Display the listing data
      console.log("\n"); // Add a new line for spacing

      console.log(chalk.yellowBright("Enter the new data:\n")); // Display message to enter updated data
      const answers = await inquirer.prompt(questions); // Prompt the user for the updated data

      const updatedListing = await Update_Listing(id, answers); // Update the listing
      if (!updatedListing) {
        // If the listing is not found, display an error message
        console.log(chalk.redBright("\nListing not found.\n"));
        continue; // Skip updating the listing
      }
      console.log("\n"); // Add a new line for spacing
      console.log(updatedListing); // Display the updated listing data
      console.log("\n"); // Add a new line for spacing
      console.log(
        chalk.yellowBright("Above listing updated successfully!\n")
      ); // Display success message
    }

    // checks if user selected delete listing and prompts the user for the listing id
    if (removeColor(command) === "Delete listing") {
       const { id } = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter the ID of the listing item to delete: ",
        filter: (value) => {
          return value.trim(); // Remove whitespace
        },
      });
      console.log("\n"); // Add a new line for spacing
      const deletedListing = await Delete_Listing(id); // Delete the listing
      if (!deletedListing) {
        // If the listing is not found, display an error message
        console.log(chalk.redBright("\nListing not found.\n"));
        continue; // Skip deleting the listing
      }
      console.log("\n"); // Add a new line for spacing
      console.log(deletedListing); // Display the deleted listing data
      console.log("\n"); // Add a new line for spacing
      console.log(chalk.redBright("Above listing deleted successfully!\n")); // Display success message
    }

    // checks if user selected delete all listings and deletes all the listings
    if (removeColor(command) === "Delete all listings") {
      console.log("\n"); // Add a new line for spacing
      const { isConfirmed } = await inquirer.prompt({
        type: "confirm",
        name: "isConfirmed",
        message: chalk.redBright(
          "Are you sure you want to delete all listings?"
        ), // Confirmation message
        default: false, // Default value is false
      });
      if (!isConfirmed) {
        // If the user does not confirm, skip deleting all listings
        console.log(chalk.yellowBright("\nDelete all listings, cancelled.\n\n"));
        continue;
      }
      console.log("\n"); // Add a new line for spacing
      const deletedListings = await Delete_All_Listings(); // Delete all the listings
      console.log(deletedListings); // Display the deleted listings data
      console.log("\n"); // Add a new line for spacing
      Seed_Data_Added = false; // Reset the seed data added
    }
  }
};

runCLI(); // Run the CLI
