export default function command({bot, db, parsed, message}) {
    bot.post(`Hosting ${Object.keys(db.data).length} users with a custom wrapper. // made by jaxonbaxon#7560`, message.origin)
}