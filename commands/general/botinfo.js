const { SlashCommandBuilder } = require('@discordjs/builders');

const functions = require('../../resources/functions.js');
const commands = require('../../handlers/YAML.js').commandSettings();

module.exports = {
    enabled: commands.general.botinfo.enabled,
    roles: commands.general.botinfo.roles,
    category: 'General',
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Displays all relevant information about the bot.'),

    async execute(client, interaction) {

        try {
            const packages = require('../../package.json');
            const os = process.platform;

            const totalMemory = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(0);
            const usedMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0);

            const usedMemoryPercent = usedMemory / totalMemory * 100;
            const memoryEmoji = usedMemoryPercent < 50 ? ':green_circle:' : (usedMemoryPercent < 90 ? ':yellow_circle:' : ':red_circle:');

            functions.sendInteractionEmbed(interaction, '', '', '', 'Bot Info', '', [{ name: 'Author', value: 'Aidan & [Lucid](https://discord.gg/xYsDx6kbX7)', inline: true }, { name: 'Discord.JS Version', value: packages.dependencies['discord.js'], inline: true }, { name: 'NodeJS Version', value: process.version, inline: true }, { name: 'Operating System', value: os.charAt(0).toUpperCase() + os.slice(1), inline: true }, { name: 'Memory Usage', value: `${memoryEmoji} **${usedMemory}**/**${totalMemory}mb**`, inline: true }, { name: 'Servers', value: client.guilds.cache.size.toString(), inline: true }, { name: 'Users', value: client.users.cache.size.toString(), inline: true }]);
        } catch (error) {
            if (settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };

    },
};