const day = new Date();
const dayNumber = day.getDate();

const ENmonth = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ENdayMonth = `${ENmonth[day.getMonth()]}, ${dayNumber}`;

module.exports = ENdayMonth;
