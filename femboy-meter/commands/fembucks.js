export default function command({bot, db, message}) {
    if(!db.data.hasOwnProperty(message.author)) return;
    bot.post(`You have ${db.data[message.author].fembucks} fembucks!`, message.origin)
}