const day = new Date();
const dayNumber = day.getDate();

const month = new Array(12);
month[0] = 'Января';
month[1] = 'Февраля';
month[2] = 'Марта';
month[3] = 'Апреля';
month[4] = 'Мая';
month[5] = 'Июня';
month[6] = 'Июля';
month[7] = 'Августа';
month[8] = 'Сентября';
month[9] = 'Октября';
month[10] = 'Ноября';
month[11] = 'Декабря';

const dayMonth = dayNumber + ' ' + month[day.getMonth()];

module.exports = dayMonth;
