import { Client, ColorResolvable, Message, MessageEmbed } from "discord.js";
import NanoTimer from "nanotimer";
import { BotCache } from './cache';

export class BotClient extends Client {
  commands: Record<string, command> = {}
  prefix: string = ''



  constructor(prefix: string) {
    super()
    this.commands['ping'] = ping
    this.prefix = prefix
    let cache = new BotCache()
    cache.set('nanoTimer', new NanoTimer(false))

    process.on('uncaughtException', console.error)
    process.on('unhandledRejection', console.error)
  }


  setCommand(name: string, cb: command) {
    this.commands[name] = cb
  } 



  start(token: string) {
    this.on('message', msg => {
      if (!msg.content.startsWith(this.prefix)) return
      if (msg.author.bot) return

      const args = msg.content.slice(this.prefix.length).trim().split(/ +/g);
      
      const command = args.shift()?.toLowerCase();

      if (command && this.commands[command]) {
        let cmd = this.commands[command]

        cmd(msg, args, this)
      }

    })


    this.on('ready', () => {
      if (!this.user) return
      console.log(`Logged in as ${this.user.tag}`)

      this.user.setActivity({
        type: 'WATCHING',
        name: `${this.prefix}remind`
      })
    })


    this.login(token)
  }

}


async function ping(message: Message, args: string[], client: Client) {
  message.channel.send(`🏓 Pong! ${client.ws.ping}ms`).catch(e => console.error)
}


export class SimpleEmbed extends MessageEmbed {
  constructor(color: ColorResolvable, title: string, desc?: string) {
    super({
      color: color,
      title: title,
      description: desc
    })
  }
}


export type command = (message: Message, args: string[], client: Client) => any
