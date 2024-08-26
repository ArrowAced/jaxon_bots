export default function command({bot, db, parsed, message}) {
    if(!db.data.hasOwnProperty(message.author)) return;
    db.data[message.author].notify = !db.data[message.author].notify
    bot.post(`Set notifications to ${db.data[message.author].notify}`, message.origin)
}