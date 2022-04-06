const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = require('../../handlers/YAML.js').commandSettings();
const settings = require('../../handlers/YAML.js').loadSettings();

const functions = require('../../resources/functions.js');
const connection = require('../../handlers/database.js');

module.exports = {
    enabled: commands.general.setup.enabled,
    roles: commands.general.setup.roles,
    category: 'General',
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets the bots database up'),

    async execute(client, interaction) {
        
        connection.query(`CREATE TABLE IF NOT EXISTS applications (userid VARCHAR(255), id VARCHAR(255) PRIMARY KEY, type VARCHAR(255), status VARCHAR(255))`, function(error) {
            if(error) {
                if (settings.client.debug == true) return console.error(error);
                return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
            };
            functions.sendInteractionEmbed(interaction, '', '', '', 'Database Setup', 'The database has been successfully setup and I am now ready to be used!');
        });

    },
};