const { SlashCommandBuilder } = require('@discordjs/builders');
const { addPlaceholders } = require('pyroutils');

const connection = require('../../handlers/database.js');
const commands = require('../../handlers/YAML.js').commandSettings();
const lang = require('../../handlers/YAML.js').loadLanguage();

const functions = require('../../resources/functions.js');

module.exports = {
    enabled: commands.applications.accept.enabled,
    roles: commands.applications.accept.roles,
    category: 'Applications',
    data: new SlashCommandBuilder()
        .setName('accept')
        .setDescription('Accepts a users application')
        .addStringOption(option => option.setName('application-id')
            .setDescription('The ID of the application you wish to accept')
            .setRequired(true)),

    async execute(client, interaction) {

        try {
            const id = interaction.options.getString('application-id');
            const { applicationAccepted, applicationAcceptedAdmin } = lang.applications;

            connection.query(`SELECT * FROM applications WHERE id = ?`, id, function (error, rows) {
                if (error) {
                    if (settings.client.debug == true) return console.error(error);
                    return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
                };

                if (!rows[0]) return functions.sendInteractionEmbed(interaction, '', '', '', 'Error', `Application ${id} could not be found, please try again`);
                if (rows[0].status == 'accepted' || rows[0].status == 'denied') return functions.sendInteractionEmbed(interaction, '', '', '', 'Application already responded', `That application has already been ${rows[0].status}`)

                const member = interaction.guild.members.cache.get(rows[0].userid);

                functions.sendInteractionEmbed(interaction, applicationAcceptedAdmin.author.name, applicationAcceptedAdmin.author.icon_url, applicationAcceptedAdmin.author.url, applicationAcceptedAdmin.title, addPlaceholders(applicationAcceptedAdmin.description, { user: `<@${rows[0].userid}>` }), applicationAcceptedAdmin.fields, addPlaceholders(applicationAcceptedAdmin.footer.text, { id: rows[0].id }), applicationAcceptedAdmin.footer.icon_url, applicationAcceptedAdmin.thumbnail, applicationAcceptedAdmin.image, applicationAcceptedAdmin.timestamp);
                functions.sendEmbed(member, applicationAccepted.author.name, applicationAccepted.author.icon_url, applicationAccepted.author.url, applicationAccepted.title, addPlaceholders(applicationAccepted.description, { user: interaction.user }), applicationAccepted.fields, addPlaceholders(applicationAccepted.footer.text, { id: rows[0].id }), applicationAccepted.footer.icon_url, applicationAccepted.thumbnail, applicationAccepted.image, applicationAccepted.timestamp);

                connection.query(`UPDATE applications SET status = ? WHERE id = ?`, ['accepted', id], function (error) { if (error) return console.error(error); });
            });

        } catch (error) {
            if (settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };

    },
};