const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
client.commands = new Discord.Collection();
client.slash = new Discord.Collection();
client.aliases = new Discord.Collection();
require('dotenv').config();

['hanlders', 'events'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err}`);
});

client.login(process.env.TOKEN);