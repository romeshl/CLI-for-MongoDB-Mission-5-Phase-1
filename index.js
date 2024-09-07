#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";


function removeColor(text) {
  // Function to remove color attributes
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

// Function to detect "ESC" key press and exit
const detectEscAndExit = () => {
  process.stdin.setRawMode(true);  // Enable raw mode to detect keypress
  process.stdin.resume();
  process.stdin.on('data', (key) => {
    // Detect "ESC" key (ASCII code 27)
    if (key.toString() === '\u001b') {
      console.log(chalk.redBright('\nESC detected. Exiting...'));
      process.exit();  // Exit the process
    }
  });
};

const options = [ // Options for the CLI
  {
    type: "list",
    name: "command",
    message: chalk.bold(chalk.yellowBright("Choose an option:")),
    choices: [chalk.magentaBright("Add data"), chalk.redBright("Exit")],
  },
];

const questions = [
  // data to be added to the listings
  {
    type: "input",
    name: "title",
    message: "Enter the title of the listing item: ",
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

const runCLI = async () => { // Starting the CLI
  console.clear(); // Clear the console
  console.log(chalk.greenBright(chalk.bold("Welcome to the CLI!"))); // Welcome message
  console.log(chalk.greenBright(chalk.bold("===================\n\n\n")));
  
  while (true) { // Loop to keep the CLI running

    detectEscAndExit();  // Start listening for ESC
    const { command } = await inquirer.prompt(options); // Display options and wait for user input
    console.log("\n");
    if (removeColor(command) === "Exit") { // checks if user selected exit and exits the CLI
      console.log("Goodbye!");
      break;
    }

    if (removeColor(command) === "Add data") { // checks if user selected add data and prompts the user for data
      const answers = await inquirer.prompt(questions);
      console.log("\n");
      console.log(answers);
      console.log("\n");
    }
  }
};

runCLI(); // Run the CLI
