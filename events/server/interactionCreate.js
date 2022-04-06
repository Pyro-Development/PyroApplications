const functions = require('../../resources/functions');
const connection = require('../../handlers/database.js');
const settings = require('../../handlers/YAML.js').loadSettings();

module.exports = {
    name: 'interactionCreate',
    enabled: true,
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        await interaction.deferReply();

        const member = interaction.guild.members.cache.get(interaction.user.id);
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;
        hasPermission = false;

        try {

            if (command.roles.length == 0) hasPermission = true;
            if (member.roles.cache.some((role) => command.roles.includes(role.name) || command.roles.includes(role.id)) || member.permissions.has('ADMINISTRATOR')) hasPermission = true;

            if (hasPermission != true) {
                functions.sendInteractionEmbed(interaction, 'Invalid Permission', '', '', '', 'You don\'t have the correct permissions to use this command.')
                return setTimeout(() => interaction.deleteReply(), 3000);
            }

            await command.execute(client, interaction);
        } catch (error) {
            if (error) {
                if(settings.client.debug == true) return console.error(error);
                return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
            };
            return functions.sendInteractionEmbed(interaction, 'Command Error', '', '', '', `An error has occured, please contact a server administrator`)
        };

    },
};