export default function command({bot, db, parsed, message, trade}) {
    // if(!db.data.hasOwnProperty(message.author)) return;
    bot.post(`sell price: ${trade.sell}\nreturn: ${trade.get}`, message.origin)
}