export default async function command({bot, db, parsed, message}) {
    if(!db.data.hasOwnProperty(message.author)) return;
    if (parsed.args[0]) {
        if (db.data[message.author].items.includes(parsed.args[0])) {
            if (!db.data[message.author].equipped.includes(shop[parsed.args[0]])) {
                if (shop[parsed.args[0]]['delete_on_use']) {
                    db.data[message.author].items.splice(db.data[message.author].items.indexOf(parsed.args[0]), 1)
                } else {
                    db.data[message.author].equipped.push(parsed.args[0])
                    db.data[message.author].items.splice(db.data[message.author].items.indexOf(parsed.args[0]), 1)
                }
                let use = shop[parsed.args[0]]['use-msg'][Math.floor(Math.random() * shop[parsed.args[0]]['use-msg'].length)]
                db.data[message.author].meter += shop[parsed.args[0]].femgain
                let ulist = await bot.get('ulist')
                use = use.replace(/#/g, ulist[Math.floor(Math.random() * ulist.length)])
                bot.post(use, message.origin)
            } else {
                bot.post(`You can't equip that!`, message.origin)
            }
        } else {
            bot.post(`You don't have that item!`, message.origin)
        }
    }
}