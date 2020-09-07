const day = new Date();
const dayNumber = day.getDate();

const ENmonth = new Array(12);
ENmonth[0] = 'January';
ENmonth[1] = 'February';
ENmonth[2] = 'March';
ENmonth[3] = 'April';
ENmonth[4] = 'May';
ENmonth[5] = 'June';
ENmonth[6] = 'July';
ENmonth[7] = 'August';
ENmonth[8] = 'September';
ENmonth[9] = 'October';
ENmonth[10] = 'November';
ENmonth[11] = 'December';

const ENdayMonth = ENmonth[day.getMonth()] + ', ' + dayNumber;

module.exports = ENdayMonth;
