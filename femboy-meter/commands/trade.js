export default function command({ bot, db, message, trade }) {
    if (!db.data.hasOwnProperty(message.author)) return;
    if (db.data[message.author].lasttrade == 0 || (Math.floor(Date.now() / 1000) - db.data[message.author].lasttrade) >= 60) {
        if (db.data[message.author].meter >= 20) {
            db.data[message.author].meter -= trade.sell
            db.data[message.author].fembucks += trade.get
            db.data[message.author].lasttrade = message.timestamp
            bot.post(`Traded ${trade.sell} points off your femboy meter for ${trade.get} fembucks!`, message.origin)
        } else {
            bot.post('You don\'t have enough points on your femboy meter!', message.origin)
        }
    } else {
        bot.post('Wait 1 minute until trading again!', message.origin)
    }
}