const Discord = require('discord.js');
const fs = require('fs')
const utility = require('./util')
const NanoTimer = require('nanotimer')

const timer = new NanoTimer()
const client = new Discord.Client();
function readConfig() {
  return JSON.parse(fs.readFileSync('./config.json').toString())
}

const config = readConfig()
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (!msg.content.startsWith(config.prefix)) return

  
  let args = msg.content.split(' ')
  args.shift()
  
  if (msg.content.startsWith(`${config.prefix}ping`)) {
    
    msg.channel.send(`🏓 Pong! ${client.ws.ping}ms`)
  }

  if (msg.content.startsWith(`${config.prefix}remind`)) {
    let timeInMS = utility.parseTime(args[0])
    if (timeInMS == 'Error') return msg.channel.send('An error occurred. Remember the format is `HOURS:MINS:SECS`')

    args.shift()
    const embed = new Discord.MessageEmbed()
      .setColor('#606e8c')
      .setTitle('⏱Reminder')
      .setDescription(`Reminding you in \`${timeInMS / 1000}\` seconds:\n\`\`\`${args[0] ? args.join(' ') : 'No reason provided'}\`\`\``)
    msg.channel.send(embed)
    
    
    timer.setTimeout(() => {
      msg.author.send(utility.timeUp(args, msg))
    }, '',`${timeInMS}m`)
  }
})

client.login(config.token)