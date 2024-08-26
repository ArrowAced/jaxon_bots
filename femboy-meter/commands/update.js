export default function command({bot, message, notes}) {
    // if(!db.data.hasOwnProperty(message.author)) return;
    bot.post(notes, message.origin)
}