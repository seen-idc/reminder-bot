import { readFileSync } from 'fs';
import { remind } from './remind';
import { BotClient } from './util';

interface Config {
  prefix: string
  token: string
}

function readConf(): Config {
  const config = readFileSync(`${__dirname}/../config.json`).toString()
  return JSON.parse(config)
}

const { prefix, token } = readConf()
const client = new BotClient(prefix)

client.setCommand('remind', remind) 
client.setCommand('remindme', remind)
client.setCommand('reminder', remind)
client.setCommand('r', remind)
client.setCommand('rm', remind)



client.start(token)