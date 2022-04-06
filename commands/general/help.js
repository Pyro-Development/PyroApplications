const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');

const settings = require('../../handlers/YAML.js').loadSettings();

module.exports = {
    enabled: true,
    roles: [],
    category: 'General',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the help message'),

    async execute(client, interaction) {

        try {
            const generalCommandsList = [];
            fs.readdirSync(`${process.cwd()}/commands/general`).forEach((file) => {
                const filen = require(`${process.cwd()}/commands/general/${file}`);
                const name = `\`${filen.data.name}\``
                generalCommandsList.push(name);
            });

            const applicationCommandsList = [];
            fs.readdirSync(`${process.cwd()}/commands/applications`).forEach((file) => {
                const filen = require(`${process.cwd()}/commands/applications/${file}`);
                const name = `\`${filen.data.name}\``
                applicationCommandsList.push(name);
            });

            const helpEmbed = new MessageEmbed()
                .setTitle(`${client.user.username} Help`)
                .addField('🤝 - General Commands', generalCommandsList.map((data) => `${data}`).join(', '), true)
                .addField('📝 - Application Commands', applicationCommandsList.map((data) => `${data}`).join(', '), true)
                .setColor(settings.branding.server_embed_color)
            interaction.editReply({ embeds: [helpEmbed] })
        } catch (error) {
            if (settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };

    },
};