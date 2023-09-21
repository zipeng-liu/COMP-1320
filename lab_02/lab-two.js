// Constant --- Define month and day lists.

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
'July', 'August', 'September', 'October', 'November', 'December'];

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


// Helper function --- Give a year, to check if it is a 
// leap year. Return true if it is.

function isLeapYear(year) {
  if (year % 4 == 0) {
    if (year % 100 == 0) {
      return (year % 400 == 0);
    } else {
      return true;
    }
  } else {
    return false;
  }
}


// Helper function --- Give a month name and convert it into 
// its related number for calculation.

function getMonthCode(month) {
  if (month == "January") {
    return 1;
  } else if (month == "February") {
    return 4;
  } else if (month == "March") {
    return 4;
  } else if (month == "April") {
    return 0;
  } else if (month == "May") {
    return 2;
  } else if (month == "June") {
    return 5;
  } else if (month == "July") {
    return 0;
  } else if (month == "August") {
    return 3;
  } else if (month == "September") {
    return 6;
  } else if (month == "October") {
    return 1;
  } else if (month == "November") {
    return 4;
  } else {
    return 6;
  }
}


// Helper function --- Give a year, and extract it century 
// in 4 digits number.

function getCentury(year) {
  const century = Math.floor(year / 100);
  return (century * 100);
}


// Main function --- Give the year, month, and day, then
// return what day of the week this date is.

function getDayOfTheWeek(year, month, day) {
    const result = 0;
    const two_digit_year = year % 100;
    const step1 = Math.floor(two_digit_year / 12);
    const step2 = two_digit_year - step1 * 12;
    const step3 = Math.floor(step2 / 4);
    const step4 = day;
    let step5 = getMonthCode(month);

    if (isLeapYear(year) && (month == "January" || month == "February")) {
      step5 -= 1;
    } 

    if (getCentury(year) == 1600) {
      step5 += 6;
    } else if (getCentury(year) == 1700) {
      step5 += 4;
    } else if (getCentury(year) == 1800) {
      step5 += 2;
    } else if (getCentury(year) == 2000) {
      step5 += 6;
    } else if (getCentury(year) == 2100) {
      step5 += 4;
    }

    const step6 = (step1 + step2 + step3 + step4 + step5) % 7;
    return days[step6];
}


// Helper function --- Give year and month, then return
// how many days this month has.

function getDayNumber(year, month) {
  if (month == 4 || month == 6 || month == 9 || month == 11) {
    return 30; 
  } else if (month == 2) {
    if (isLeapYear(year)) {
      return 29;
    } else {
      return 28;
    }
  } else {
    return 31; 
  }
}


// Main function --- Prints out all the date & the
// day of the week for a given year.

function makeCalendar(year) {
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= getDayNumber(year, month); day++) {
      const day_Of_Week = getDayOfTheWeek(year, months[month - 1], day);
      console.log(`${month}-${day}-${year} is a ${day_Of_Week}.`);
    }
  }
}


// Export functions.

module.exports = {
  makeCalendar,
  getDayOfTheWeek
};


