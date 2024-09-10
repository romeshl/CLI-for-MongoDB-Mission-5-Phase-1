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
} from "./DB_Operations/Listing_transactions.js"; // Import the functions to perform CRUD operations on the listings

import { options, questions } from "./Components/Inquirer_prompts.js"; // Import the inquirer prompts for the CLI

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

export function Show_Data(data, message) {
  // Function to display the data from listing operations
  console.log("\n");
  console.log(data);
  console.log("\n");
  console.log(chalk.yellowBright(message));
  console.log("\n");
}

export function Show_Error(error) {
  // Function to display the error message from listing operations
  console.log(chalk.redBright(`\n${error}\n`));
}

// Main function to run the CLI
const runCLI = async () => {

  let keepRunning = true; // Variable to keep the CLI running

  detectEscAndExit(); // Start listening for ESC presses and exit if it's pressed

  if (!db) {
    // Check if the database connection was unsuccessful
    console.log(chalk.redBright("Unable to connect to MongoDB. Exiting..."));
    process.exit(); // Exit to the terminal
  }

  console.clear(); // Clear the console
  console.log(chalk.yellowBright(chalk.bold("Welcome Trademe listings data feeder CLI"))); // Welcome message
  console.log(chalk.yellowBright(chalk.bold("========================================\n")));
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

    if (removeColor(command) === "Clear Screen") {
      console.clear(); // Clear the terminal screen
      continue; // Skip the rest of the loop
    }

    // checks if user selected add data and prompts the user for data
    if (removeColor(command) === "Add listing") {
      const answers = await inquirer.prompt(questions);
      try {
        const added_data = await Add_Listing(answers); // Add listing
        Show_Data(added_data, "Listing added successfully!");
      } catch (error) {
        Show_Error(`Unable to add listing. Error: ${error.message}`);
      }
    }

    // checks if user selected add seed data and adds the seed data to the listings
    if (removeColor(command) === "Add seed data") {
      if (Seed_Data_Added) { // checks if seed data has already been added once
        console.log(
          chalk.yellowBright("\nSeed data has already been added.\n\n")
        );
        continue; // Skip adding seed data
      }
      try {
        const seeded_data = await Add_Seed_Data(Seed_Data); // Add seed data
        Show_Data(
          seeded_data,
          `Seed data added Successfully. No. of listings added: ${seeded_data.length}`
        );
      } catch (error) {
        Show_Error(`Unable to add seed data. Error: ${error.message}`);
      }
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
      try {
        const show_data = await Show_Listing(id); // Show listing
        Show_Data(show_data, "Listing found.");
      } catch (error) {
        Show_Error(`Unable to show listing. Error: ${error.message}`);
      }
    }

    // checks if user selected show listings and displays all the listings
    if (removeColor(command) === "Show listings") {
      console.log("\n"); // Add a new line for spacing
      try {
        const show_data = await Show_Listings(); // Show all listings
        Show_Data(show_data, `No. of listings: ${show_data.length}`);
      } catch (error) {
        Show_Error(`Unable to show listings. Error: ${error.message}`);
      }
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
      try {
        const show_data = await Show_Listing(id); // Show the listing to be updated
        Show_Data(show_data, "Listing to be updated.");
        console.log(chalk.yellowBright("Enter the updated data:"));
        const answers = await inquirer.prompt(questions); // Prompt the user for updated data
        const updated_data = await Update_Listing(id, answers); // Update the listing
        Show_Data(updated_data, "Listing updated successfully!");
      } catch (error) {
        Show_Error(`Unable to update listing. Error: ${error.message}`);
      }
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
      try {
        const show_data = await Show_Listing(id); // Show the listing to be deleted
        Show_Data(show_data, "Listing to be deleted.");
        const { isConfirmed } = await inquirer.prompt([ // Confirm deletion
          {
            type: "confirm",
            name: "isConfirmed",
            message: chalk.redBright(
              "Are you sure you want to delete the listing?"
            ),
          },
        ]);
        if (isConfirmed) {
          const delete_data = await Delete_Listing(id); // Delete the listing
          Show_Data(delete_data, "Listing deleted.");
        } else {
          console.log(chalk.yellowBright("\nDeletion cancelled.\n"));
        }
      } catch (error) {
        Show_Error(`Unable to delete listing. Error: ${error.message}`);
      }
    }

      // checks if user selected delete all listings and deletes all the listings
      if (removeColor(command) === "Delete all listings") {
        try {
          const { isConfirmed } = await inquirer.prompt([ // Confirm deletion
            {
              type: "confirm",
              name: "isConfirmed",
              message: chalk.redBright(
                "Are you sure you want to delete all listings?"
              ),
            },
          ]);
          if (isConfirmed) {
            const delete_all_data = await Delete_All_Listings(); // Delete all listings
            Show_Data(delete_all_data, `Deleted All listings.`);
          } else {
            console.log(chalk.yellowBright("\nDeletion cancelled.\n"));
          }
        } catch (error) {
          Show_Error(`Unable to delete listings. Error: ${error.message}`);
        }
      }
    }
  };

  runCLI(); // Run the CLI
