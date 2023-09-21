// Require files.

const lab2 = require("./lab-two.js");
const readlineSync = require("readline-sync");


// Prints out all the calender dates in 2022.

lab2.makeCalendar(2022);


// Main function --- Convert user imput date into 
// the day of the week.

function getDayOfTheWeekForUserDate() {
  const currentYear = Number(readlineSync.question("What is the current year?"));
  const currentMonth = readlineSync.question("What is the current month?");
  const currentDay = Number(readlineSync.question("What is the current day?"));
  const day_Of_Week = lab2.getDayOfTheWeek(currentYear, currentMonth, currentDay);
  console.log("Today is " + day_Of_Week + ".");
}


// Run the function.

getDayOfTheWeekForUserDate()