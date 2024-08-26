export default function command({bot, db, parsed, message}) {
    if (parsed.args[0]) {
        let user = parsed.args[0];
        if (db.data.hasOwnProperty(user)) {
            bot.post(`${user} is ${db.data[user].meter}% a femboy!`, message.origin)
        } else {
            bot.post(`${user} is not in the database!`, message.origin)
        }
    }
}