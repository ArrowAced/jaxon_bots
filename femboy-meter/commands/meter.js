export default function command({bot, db, parsed, message}) {
    if (db.data.hasOwnProperty(message.author)) {
        db.data[message.author].meter += Math.floor(Math.random() * 21) - 10;
        if (db.data[message.author].meter > 100) db.data[message.author].meter = 100;
        if (db.data[message.author].meter < 0) db.data[message.author].meter = 0;
        bot.post(`You are ${db.data[message.author].meter}% a femboy!`, message.origin)
    } else {
        db.data[message.author] = { meter: Math.floor(Math.random() * 101), fembucks: 0, items: [], equipped: [], lasttrade: 0, notify: false, luckynum: Math.floor(Math.random() * 51)}
        bot.post(`You are ${db.data[message.author].meter}% a femboy!`, message.origin)
    }
}