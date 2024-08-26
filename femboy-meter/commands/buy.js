export default function command({ bot, db, parsed, message }) {
    if(!db.data.hasOwnProperty(message.author)) return;
    if (parsed.args.length > 0) {
        if (shop.hasOwnProperty(parsed.args[0])) {
            if (db.data[message.author].fembucks >= shop[parsed.args[0]].price) {
                db.data[message.author].fembucks -= shop[parsed.args[0]].price;
                db.data[message.author].items.push(parsed.args[0]);
                bot.post(`You bought ${parsed.args[0]}!`, message.origin)
            } else {
                bot.post(`You don't have enough fembucks!`, message.origin)
            }
        } else {
            bot.post(`That item doesn't exist!`, message.origin)
        }
    } else {
        bot.post(`You didn't specify an item!`, message.origin)
    }
}