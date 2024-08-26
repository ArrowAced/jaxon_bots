export default function command({bot, db, message}) {
    if(!db.data.hasOwnProperty(message.author)) return;
    if (db.data[message.author].items.length > 0) {
        bot.post(db.data[message.author].items.join(', '), message.origin)
    } else {
        bot.post(`You don't have any items!`, message.origin)
    }
}