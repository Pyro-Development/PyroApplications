const { Client, Intents, Collection } = require('discord.js');

const functions = require('./resources/functions.js');
const settings = require('./handlers/YAML.js').loadSettings();

const client = new Client({ intents: [32767] });

client.commands = new Collection();

require('./handlers/loader.js').loadEvents(client);
require('./handlers/loader.js').loadCommands(client);

client.login(settings.client.token).catch((error) => { if (error) return console.error(error); });