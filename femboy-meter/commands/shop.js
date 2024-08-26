export default function command({ bot, parsed, message, shop }) {
    let assembly = []
    Object.keys(shop).forEach(item => {
        assembly.push(`${item} - ${shop[item].price} fembucks - ${shop[item].description}`)
    })
    if (parsed.args.length > 0) {
        assembly.forEach(item => {
            if (item.startsWith(parsed.args[0])) {
                bot.post(item, message.origin)
            }
        })
    } else {
        bot.post(assembly.join('\n'), message.origin)
    }
}