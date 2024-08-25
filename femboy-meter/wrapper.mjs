import { WebSocket as Watersports } from "ws";
import fetch from "node-fetch";
import { EventEmitter } from "events";

export class Bot extends EventEmitter {
    constructor(username, password) {
        super()
        this.username = username;
        this.password = password;
        this.ws = new Watersports('wss://server.meower.org');
        this.in = false;
        this.return = "";
        this.ulist = [];
        this.token = "";
    }
    send(data) {
        if (this.ws.readyState != 1) return;
        this.ws.send(data);
    }
    async login() {
        this.ws.on('open', async () => {
            const authReq = await fetch("https://api.meower.org/auth/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            })
            const authJSON = await authReq.json()
            this.ws.send(JSON.stringify({
                'cmd': 'direct',
                'val': {
                    'cmd': 'authpswd',
                    'val': {
                        'username': this.username,
                        'pswd': authJSON.token,
                    },
                },
            }))
            this.in = true;

            setInterval(() => { this.ws.send(JSON.stringify({ 'cmd': 'ping', 'val': '' })) }, 10000)
            this.emit('ready')
        })
        this.ws.on('close', () => {
            this.emit('close')
        })
        this.ws.on('message', (data) => {
            this.emit('message', data)
        })
        this.ws.on('message', (data) => {
            let list = JSON.parse(data)
            if (list.cmd == 'ulist') {
                this.ulist = list.val.split(';')
            }
        })
        this.ws.on('message', (data) => {
            let auth = JSON.parse(data)
            if (auth.cmd == 'direct' && auth.val.mode == 'auth') {
                this.token = auth.val.payload.token
            }
        })
        this.ws.on('message', (data) => {
            let msg = JSON.parse(data)
            let message = {}
            if (msg.val.type == 1) {
                try {
                    message.timestamp = msg.val.t.e
                    message.origin = msg.val.post_origin
                    if (msg.val.u == this.username) {
                        return;
                    } else if (msg.val.u == 'Discord' || msg.val.u == "Webhooks") {
                        message.content = msg.val.p.split(': ')[1]
                        message.author = msg.val.p.split(': ')[0]
                        this.emit('post', message)
                    } else {
                        message.content = msg.val.p
                        message.author = msg.val.u
                        this.emit('post', message)
                    }
                } catch (err) {
                    this.emit('error', err)
                }
            }
        })
        this.ws.on('error', (err) => {
            this.emit('error', err)
        })
    }
    async post(message, origin) {
        if (this.ws.readyState != 1) return;
        if (!message) return;
        if (!origin) origin = "home";
        if (origin == "home") {
            fetch("https://api.meower.org/home", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    token: this.token
                },
                body: JSON.stringify({
                    content: message
                })
            })

        } else {
            fetch("https://api.meower.org/posts/" + origin, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    token: this.token
                },
                body: JSON.stringify({
                    content: message
                })
            })
        }
    }
    signout() {
        if (this.ws.readyState !== 1) return;
        this.ws.close()
    }
    async get() {
        let args = arguments
        if (args.length == 0) return;
        if (args[0] == 'profile') {
            if (args[1]) {
                await fetch('https://api.meower.org/users/' + args[1])
                    .then(res => res.json())
                    .then(json => {
                        this.return = json
                    })
                return this.return;
            }
        } else if (args[0] == 'post') {
            if (args[1]) {
                await fetch('https://api.meower.org/posts?id=' + args[1])
                    .then(res => res.json())
                    .then(json => {
                        this.return = json
                    })
                return this.return;
            }
        } else if (args[0] == 'page') {
            if (args[1]) {
                await fetch('https://api.meower.org/home?page=' + args[1])
                    .then(res => res.json())
                    .then(json => {
                        this.return = json
                    })
                return this.return;
            }
        } else if (args[0] == 'ulist') {
            return this.ulist;
        }
    }
    parse(message, prefix) {
        if (message.content.startsWith(prefix)) {
            let args = message.content.slice(prefix.length).trim().split(/ +/g);
            let command = args.shift().toLowerCase();
            return { "command": command, "args": args }
        }
    }
}


