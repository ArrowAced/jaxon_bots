import fs from "fs";

export async function scan(path="./commands", path2="") {
    let commandsFolder = fs.readdirSync(path)
    let commands = {}
    for (const file of commandsFolder) {
        let command
        if (file == "commandManager.js") continue;
        if (!file.endsWith(".js")) continue;
        try {
            command = await import(`./${path2}${file}`);
        } catch(e) {
            console.log(file, e)
            continue
        }
        if (!command) continue;
        if (!command.default) continue;
        console.log("Found & imported command from " + file)
        commands[file.replace(/\.[^\.]*$/, '')] = command.default
    }
    return commands
}