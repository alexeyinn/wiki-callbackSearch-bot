const day = new Date();
const dayNumber = day.getDate();

const month = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Октября',
  'Ноября',
  'Декабря',
];

const dayMonth = `${dayNumber} ${month[day.getMonth()]}`;

module.exports = dayMonth;
