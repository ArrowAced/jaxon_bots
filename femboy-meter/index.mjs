import { join, dirname, parse } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Bot } from './wrapper.mjs';
import { config } from 'dotenv';
import * as fs from 'node:fs';
import {scan} from './commands/commandManager.js'

config();
const bot = new Bot(process.env.MEOWERUSERNAME, process.env.MEOWERPASSWORD);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let trade = {
    "sell": 15,
    "get": 20
}
const stocksgc = "8d694240-8b46-400d-98da-78ef93a550f1"
const notes = 'ver0.3.1\na random amount of interest is given to all players every 5 minutes.'
const adapter = new JSONFile(join(__dirname, 'db/db.json'));
const db = new Low(adapter, {});
const shop = {
    'socks': {
        'price': 100,
        'description': 'A pair of programming socks.',
        'femgain': 10,
        'use-msg': ['You put on your long, striped socks. They feel tight on your lower thighs and feet.', 'You put on your programming socks. Now you feel ready to program in Rust.', 'You accidentally rip your socks while putting them on. (Luckily, you have a buddy who can sew them back up.)', 'The socks are tight on your leg.', 'Incredible, you\'re more of a femboy now than you were 10 minutes ago.', 'You wiggle your toes once you put them on to really get a feel of that cotton. It feels nice.', 'I think # would like to see you wearing this.'],
        'unequip-msg': ['You took off the socks one by one.', 'Finally, fresh air.', 'Those socks were pretty tight...', 'I mean, they were comfy at first.']
    },
    'crop-top': {
        'price': 200,
        'description': 'A crop top, for when you\'re feeling like a femboy.',
        'femgain': 30,
        'use-msg': ['You put on the crop top, which was tight on your chest.', 'You put on the crop top, showing a lot of skin than you usually do.', 'It\'s pretty small, but it\'ll do.', 'I wonder what # would think of you wearing this...', 'The crop top rips at the seams while putting it on, but you\'d rather not fix it.'],
        'unequip-msg': ['It was kinda tight anyways...', 'Too small for my size.', 'I should\'t wear this casually.']
    },
    'food': {
        'price': 50,
        'description': 'A meal from your favorite restaurant!',
        'femgain': -5,
        'use-msg': ['You ate the meal, licking your lips afterward.', 'You were hungry and you ate it. The end.', 'Yummy!', 'Nom nom nom.', 'You know what, this is pretty good.', 'But why did they have human steak on the menu?', 'The snail is getting closer.', 'The food is exquisedtedt, or however you spell it.', 'Those IKEA meatballs were good.'],
        'delete_on_use': true,
    },
    'maid-outfit': {
        'price': 1000,
        'description': 'A maid outfit which quite barely fits.',
        'femgain': 80,
        'use-msg': ['You put on the maid dress, then the garments, and then everything... else.', 'The maid outfit is pretty tight on your femboy thighs.', 'Hey #, check it out!', 'Nya. Or something.', 'You are a femboy maid now.', 'The maid outfit suddenly makes you want to serve some plates at a diner.', 'You know, #, you don\'t have to stare.', 'You\'re pretty good at putting on this maid outfit, have you done it before?'],
        'unequip-msg': ['That was hard to take off.', 'Okay #, now you can look, it\'s off.', 'Not casual wear at all.', 'Why did I wear this again?', 'That felt nice for the first 30 minutes until I got hot.']
    },
    'febreze': {
        'price': 25,
        'description': 'Some febreze to keep your room smelling nice.',
        'femgain': 0,
        'use-msg': ['You sprayed some febreze, it smells nice.', 'The febreze smells wonderful.', 'You sprayed some febreze and then walked into it so that it sticks to you and you smell nice.', 'Great, your room isn\'t a biohazard now.', 'mmm....', 'The snail is getting closer.'],
        'delete_on_use': true,
    }
}

const commands = await scan()

await db.read();
if (!db.data) db.data = { };

bot.on('ready', () => {
    console.log('Bot is ready!');
})

bot.on('error', (err) => {
    console.log(err);
})

bot.on('post', async (message) => {
    //console.log(message);
    let parsed = bot.parse(message, `@${bot.username} `)
    if (parsed) {
        if (commands[parsed.command]) {
            await commands[parsed.command]({bot, db, parsed, message, shop})
        }
        await db.write()
    }
})

setInterval(async () => { await db.write() }, 5000)
setInterval(async () => {
    let percent = Math.floor(Math.random() * 11)
    Object.keys(db.data).forEach(user => {
        let interest = (db.data[user].fembucks / 100 * percent) / 100
        db.data[user].fembucks += interest
        db.data[user].fembucks = Math.floor(db.data[user].fembucks)
    })
    await db.write()
}, 300000)
setInterval(async () => { 
    trade = { sell: Math.floor(Math.random() * 21) + 1, get: Math.floor(Math.random() * 21) + 6 }
    /*
    if (trade.sell < trade.get) {
        let num = Math.floor(Math.random() * 51)
        Object.keys(db.data).forEach(user => {
            if (db.data[user].luckynum == num && db.data[user].notify) {
                bot.post(`@${user}, stakes are high!`)
            }
        })
    }
    */
   bot.post(`${trade.sell};${trade.get}`, stocksgc)
}, 30000)


bot.login()
