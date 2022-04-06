const { SlashCommandBuilder } = require('@discordjs/builders');
const { addPlaceholders } = require('pyroutils');

const commands = require('../../handlers/YAML.js').commandSettings();
const lang = require('../../handlers/YAML.js').loadLanguage();

const functions = require('../../resources/functions.js');

module.exports = {
    enabled: commands.general.ping.enabled,
    roles: commands.general.ping.roles,
    category: 'General',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the bot ping and the API ping'),

    async execute(client, interaction) {

        try {
            const { ping } = lang.general;
            functions.sendInteractionEmbed(interaction, '', '', '', 'Pinging...').then((result) => {
                functions.sendInteractionEmbed(interaction, ping.author.name, ping.author.icon_url, ping.author.url, ping.title, ping.description, [{ name: ping.fields.clientLatency.name, value: addPlaceholders(ping.fields.clientLatency.value, { clientLatency: client.ws.ping }), inline: ping.fields.apiLatency.inline }, { name: ping.fields.apiLatency.name, value: addPlaceholders(ping.fields.apiLatency.value, { apiLatency: result.createdTimestamp - interaction.createdTimestamp }), inline: ping.fields.apiLatency.inline }], ping.footer.text, ping.footer.icon_url, ping.thumbnail, ping.image, ping.timestamp);
            });
        } catch (error) {
            if (settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };

    },
};