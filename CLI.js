#!/usr/bin/env node // Shebang line to run the script as a command line tool (to run without typing Node)

import connectDB from "./Connection/MongoDB.js"; // Import the mongoose connection for the database
import { Add_Listing, Show_Listings } from "./Listing_transactions.js"; // Import the functions to add and show listings

import inquirer from "inquirer"; // Import the inquirer package for the CLI
import chalk from "chalk"; // Import the chalk package for colored text

import dotenv from "dotenv"; // Import the dotenv package to read the .env file
dotenv.config(); // Load the environment variables

const db = await connectDB(); // Connect to the database

function removeColor(text) {
  // Function to remove color attributes from text
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

// Function to detect "ESC" key press and exit
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
  // Main options for the CLI
  {
    type: "list",
    name: "command",
    message: chalk.bold(chalk.greenBright("Choose an option:")), // Main menu
    choices: [
      chalk.blueBright("Add listing"), // Adds a new listing
      chalk.magentaBright("Show listings"), // Shows all listings
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
    validate: function (value) { // Validate the input to check if it is a number and greater than 0
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

  if (!db) { // Check if the database connection was successful
    console.log(chalk.redBright("Unable to connect to MongoDB. Exiting..."));
    process.exit(); // Exit to the terminal
  }

  console.clear(); // Clear the console
  console.log(chalk.yellowBright(chalk.bold("Welcome to the CLI!"))); // Welcome message
  console.log(chalk.yellowBright(chalk.bold("===================\n\n\n")));

  while (keepRunning) {
    // Loop to keep the CLI running

    detectEscAndExit(); // Start listening for ESC presses and exit if it's pressed
    const { command } = await inquirer.prompt(options); // Display options and wait for user input

    if (removeColor(command) === "Exit") {
      // checks if user selected exit and exits the CLI
      console.log(chalk.red("\n\n\nGoodbye!\n\n\n"));
      db.connection.close(); // Close the MongoDB connection
      keepRunning = false; // Stop the loop and exit the CLI
    }

    if (removeColor(command) === "Add listing") {
      // checks if user selected add data and prompts the user for data
      const answers = await inquirer.prompt(questions);
      console.log("\n"); // Add a new line for spacing
      const addedListing = await Add_Listing(answers); // Add data to the listing
      console.log(addedListing); // Display the added listing data
      console.log("\n"); // Add a new line for spacing
    }

    if (removeColor(command) === "Show listings") {
      // checks if user selected show listings and displays all the listings
      console.log("\n"); // Add a new line for spacing
      const showListings = await  Show_Listings(); // Grabs all the listings from the collection
      console.log(showListings); // Display all the listings 
      console.log("\n"); // Add a new line for spacing
    }
  }
};

runCLI(); // Run the CLI
