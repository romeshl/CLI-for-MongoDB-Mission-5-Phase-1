#! /usr/bin/env node

import { program } from "commander";
import inqurier from "inquirer";

const questions = [
  {
    type: "input",
    name: "name", // "name" is correct here
    message: "Customer name",
  },
  {
    type: "input",
    name: "age", // "name" should be 'age' to store the answer for age
    message: "Customer age",
  },
];

program
  .command("text")
  .alias("t")
  .description("This is a test command")
  .action(() => {
    console.log("Hello from test command");
  });

program
  .command("add")
  .alias("a")
  .description("Add a customer")
  .action(() => {
    inqurier.prompt(questions).then((answers) => console.log(answers));
  });


program.parse(process.argv);
