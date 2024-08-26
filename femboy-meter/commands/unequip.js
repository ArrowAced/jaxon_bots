export default function command({ bot, db, parsed, message }) {
    if (!db.data.hasOwnProperty(message.author)) return;
    if (parsed.args[0]) {
        if (db.data[message.author].equipped.includes(parsed.args[0])) {
            db.data[message.author].equipped.splice(db.data[message.author].equipped.indexOf(parsed.args[0]), 1)
            db.data[message.author].items.push(parsed.args[0])
            db.data[message.author].femgain -= (Math.abs(shop[parsed.args[0]]['femgain']) / 2)
            if (shop[parsed.args[0]].hasOwnProperty('unequip-msg')) {
                bot.post(shop[parsed.args[0]]['unequip-msg'][Math.floor(Math.random() * shop[parsed.args[0]]['unequip-msg'].length)], message.origin)
            } else {
                bot.post(`You unequipped ${parsed.args[0]}.`, message.origin)
            }
        } else {
            bot.post(`You don't have that item equipped!`, message.origin)
        }
    }
}