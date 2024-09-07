#!/usr/bin/env node

import inquirer from "inquirer";

const options = [
  {
    type: "list",
    name: "command",
    message: "Choose an option:",
    choices: ["Add data", "Print bullshit", "Exit"],
  },
];

const questions = [
  {
    type: "input",
    name: "title",
    message: "Enter the title of the listing item: ",
  },
  {
    type: "input",
    name: "description",
    message: "Enter the description of the listing item: ",
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

const runCLI = async () => {
  console.clear();
  console.log("Welcome to the CLI!");
  while (true) {
    const { command } = await inquirer.prompt(options);

    if (command === "Exit") {
      console.log("Goodbye!");
      break;
    }

    if (command === "Add data") {
      const answers = await inquirer.prompt(questions);
      console.log("\n\n\n\n\n");
      console.log(answers);
      console.log("\n\n\n\n\n");
    } else if (command === "Print bullshit") {
      console.log("This is some bullshit...");
    }
  }
};

runCLI();
