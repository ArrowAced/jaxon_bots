export default function command({ bot, db, parsed, message }) {
    if (!db.data.hasOwnProperty(message.author)) return;
    if (parsed.args[0]) {
        if (db.data[message.author].equipped.includes(parsed.args[0])) {
            bot.post(`You have ${parsed.args[0]} equipped.`, message.origin)
        } else {
            bot.post(`You do not have ${parsed.args[0]} equipped.`, message.origin)
        }
    } else {
        bot.post(db.data[message.author].equipped.join(', '), message.origin)
    }
}