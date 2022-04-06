const { SlashCommandBuilder } = require('@discordjs/builders');
const { addPlaceholders } = require('pyroutils');

const connection = require('../../handlers/database.js');
const commands = require('../../handlers/YAML.js').commandSettings();
const lang = require('../../handlers/YAML.js').loadLanguage();

const functions = require('../../resources/functions.js');

module.exports = {
    enabled: commands.applications.deny.enabled,
    roles: commands.applications.deny.roles,
    category: 'Applications',
    data: new SlashCommandBuilder()
        .setName('deny')
        .setDescription('Denys a users application')
        .addStringOption(option => option.setName('application-id')
            .setDescription('The ID of the application you wish to deny')
            .setRequired(true))
        .addStringOption(option => option.setName('reason')
            .setDescription('The reason you are denying the application')
            .setRequired(true)),

    async execute(client, interaction) {

        try {
            const id = interaction.options.getString('application-id');
            const reason = interaction.options.getString('reason')
            const { applicationDenied, applicationDeniedAdmin } = lang.applications;

            connection.query(`SELECT * FROM applications WHERE id = ?`, id, function (error, rows) {
                if (error) {
                    if (settings.client.debug == true) return console.error(error);
                    return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
                };

                if (!rows[0]) return functions.sendInteractionEmbed(interaction, '', '', '', 'Error', `Application ${id} could not be found, please try again`);
                if (rows[0].status == 'accepted' || rows[0].status == 'denied') return functions.sendInteractionEmbed(interaction, '', '', '', 'Application already responded', `That application has already been ${rows[0].status}`)

                const member = interaction.guild.members.cache.get(rows[0].userid);

                functions.sendInteractionEmbed(interaction, applicationDeniedAdmin.author.name, applicationDeniedAdmin.author.icon_url, applicationDeniedAdmin.author.url, applicationDeniedAdmin.title, addPlaceholders(applicationDeniedAdmin.description, { user: `<@${rows[0].userid}>` }), applicationDeniedAdmin.fields, addPlaceholders(applicationDeniedAdmin.footer.text, { id: rows[0].id }), applicationDeniedAdmin.footer.icon_url, applicationDeniedAdmin.thumbnail, applicationDeniedAdmin.image, applicationDeniedAdmin.timestamp);
                functions.sendEmbed(member, applicationDenied.author.name, applicationDenied.author.icon_url, applicationDenied.author.url, applicationDenied.title, addPlaceholders(applicationDenied.description, { user: interaction.user, reason: reason }), applicationDenied.fields, addPlaceholders(applicationDenied.footer.text, { id: rows[0].id }), applicationDenied.footer.icon_url, applicationDenied.thumbnail, applicationDenied.image, applicationDenied.timestamp);

                connection.query(`UPDATE applications SET status = ? WHERE id = ?`, ['denied', id], function (error) { if (error) return console.error(error); });
            });

        } catch (error) {
            if (settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };

    },
};