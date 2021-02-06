const welcomeMessage = (ctx) => `Здравствуйте ${ctx.message.from.first_name}!
Введите Ваш запрос, чтобы получить краткую выдержку из "Википедии", ссылку на полную статью, а так же на другие возможные значения вашего запроса.
(Имена и фамилии людей нужно вводить с большой буквы. Большими буквами весь запрос - писать нельзя)
Либо введите команду /help , для получения информации об этом боте, контактной информации и др.
Good day ${ctx.message.from.first_name}!
Send your quastion for getting short discription from Wiki, link on full article and link on other uses your search-word.
(Person's first name and last name, first char, must by writen in Upperсase)
Or just send command /help , for get bot's info, contacts and other`;

module.exports = welcomeMessage;
