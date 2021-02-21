const Discord = require('discord.js')

module.exports.parseTime = (string) => {
  let timeArray = string.split(':');

  if (timeArray.length !== 3)
    return 'Error';

  let hour = parseInt(timeArray[0]) * 60 * 60 * 10000;
  let min = parseInt(timeArray[1]) * 60 * 1000;
  let sec = parseInt(timeArray[2]) * 1000;

  return hour + min + sec;
}
module.exports.timeUp = (args, msg) => {
  const embed = new Discord.MessageEmbed()
    .setColor('#606e8c')
    .setTitle('⏰ Time\'s Up!')
    .setDescription(`\`\`\`${args[0] ? args.join(' ') : 'No reason provided'}\`\`\`\n[\`[Original Message]\`](${msg.url})`)
  if (Math.floor((Math.random() * 10) + 1) > 5) {
    embed.setFooter('There may be some desync with the timer due to the bot\'s ping or your internet connection\nIt\'s not recommended to use this for accurate timers')
  }
  return embed
}