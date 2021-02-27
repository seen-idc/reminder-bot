import { match } from 'assert';
import { timeEnd } from 'console';
import { Message, Client } from 'discord.js';
import NanoTimer from 'nanotimer';
import { BotCache } from './cache';
import { SimpleEmbed } from './util';

export async function remind(message: Message, args: string[], client: Client) {
  if (!args[0]) {
    const embed = new SimpleEmbed('BLURPLE', '<prefix>remind USAGE', '\`<prefix>remind <time> <Reason?>\`')
    return message.channel.send(embed)
  }
  const botCache = new BotCache()
  const { display, delay } = await parseTime(args)
  
  const timer = await botCache.get('nanoTimer') as NanoTimer


  if (delay < 1 || delay > 604800) return message.channel.send(new SimpleEmbed('RED', 'Error', 'Your timer cannot be higher than 7 days or lower than 1 second.\nIt also has to be in the correct format, i.e. \`4d:12h:6m:2s\`'))
  
  args.shift()

  let reason = args[0] ? args.join(' ') : 'No reason provided'

  timer.setTimeout(endTimer, [message, reason], `${delay}s`)

  message.channel.send(new SimpleEmbed('BLURPLE', '⏱ Reminder', `Reminding you in:\n\`\`\`${display}\`\`\` for \n\`\`\`${reason}\`\`\``))
}

function endTimer(message: Message, reason: string) { 
  let link = message.url
  message.author.createDM().then(dm => {
    if (!dm) return

    dm.send(new SimpleEmbed('BLURPLE', '⏰ Times Up', `Reason: \n\`\`\`${reason}\`\`\`\n[\`[Original Message]\`](${link})`))
  })
}

async function parseTime(args: string[]) {
  let timeArray = args[0].split(':')
  let time: timeObj = await loopThroughTimeArray(timeArray)
  const { days, hours, mins, secs } = await convertTime(time)
  

  let delay = 0

  if (typeof days === 'number') {
    delay += days * 86400
  }

  if (typeof hours === 'number') {
    delay += hours * 3600
  }

  if (typeof mins === 'number') {
    delay += mins * 60
  }
  if (typeof secs === 'number') {
    delay += secs
  }
  
  

  return {
    display: `${time.days} ${time.hrs} ${time.mins} ${time.secs}`,
    delay: delay
  }
}

function matchNumber(str: string | null) {
  if (!str) return
  let matched = str.match(/[0-9]+/)
  if (!matched) return
  return parseInt(matched[0])
}
async function convertTime(time: timeObj) {
  return {
    days: matchNumber(time.days),
    hours: matchNumber(time.hrs),
    mins: matchNumber(time.mins),
    secs: matchNumber(time.secs),
  }
}

async function loopThroughTimeArray(timeArray: string[]) {
  let time: timeObj = {
    days: '0d',
    hrs: '0h',
    mins: '0m',
    secs: '0s'
  }
  timeArray.forEach(str => {
    if (str.includes('d')) return time.days = str
    if (str.includes('h')) return time.hrs = str
    if (str.includes('m')) return time.mins = str
    if (str.includes('s')) return time.secs = str
  })

  return time
}




interface timeObj {
  days: string | null
  hrs: string | null
  mins: string | null
  secs: string | null
}