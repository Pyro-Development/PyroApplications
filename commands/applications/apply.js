const { SlashCommandBuilder } = require('@discordjs/builders');
const { addPlaceholders } = require('pyroutils');
const connection = require('../../handlers/database.js');

const commands = require('../../handlers/YAML.js').commandSettings();
const lang = require('../../handlers/YAML.js').loadLanguage();
const applications = require('../../handlers/YAML.js').loadApplications();

const functions = require('../../resources/functions.js');

module.exports = {
    enabled: commands.applications.apply.enabled,
    roles: commands.applications.apply.roles,
    category: 'Applications',
    data: new SlashCommandBuilder()
        .setName('apply')
        .setDescription('Starts the application process')
        .addStringOption(option => option.setName('app-type')
            .setDescription('The application you wish to fill out')
            .setRequired(true)),

    async execute(client, interaction) {

        try {
            const type = interaction.options.getString('app-type');

            valid = false
            validApplications = '';
            appChannel = ''
            const questions = [];

            const { wrongChannel, invalidApplication, pendingApplication, applicationStarted, sendQuestion, applicationFinished, newApplication } = lang.applications;

            if (interaction.channel.id != applications.settings.commandChannel) return functions.sendInteractionEmbed(interaction, wrongChannel.author.name, wrongChannel.author.icon_url, wrongChannel.author.url, wrongChannel.title, addPlaceholders(wrongChannel.description, { channel: `<#${applications.settings.commandChannel}>` }), wrongChannel.fields, wrongChannel.footer.text, wrongChannel.footer.icon_url, wrongChannel.thumbnail, wrongChannel.image, wrongChannel.timestamp);

            applications.types.forEach(q => {
                if (type.toLowerCase() == q.name.toLowerCase()) {
                    appChannel += client.channels.cache.get(q.channel);
                    if (q.enabled == true) {
                        q.questions.forEach(question => {
                            questions.push(question);
                        });
                    };
                    valid = true
                };

                validApplications += `${q.name}\n`;
            });

            if (valid == false) return functions.sendInteractionEmbed(interaction, invalidApplication.author.name, invalidApplication.author.icon_url, invalidApplication.author.url, invalidApplication.title, addPlaceholders(invalidApplication.description, { n: '\n', types: validApplications }), invalidApplication.fields, invalidApplication.footer.text, invalidApplication.footer.icon_url, invalidApplication.thumbnail, invalidApplication.image, invalidApplication.timestamp);

            const id = functions.randomString('A#', 12);

            connection.query(`SELECT * FROM applications WHERE userid = ? AND type = ? AND status = ?`, [interaction.user.id, type.toLowerCase(), 'pending'], async function (error, rows) {
                if (error) return console.error(error);
                if (rows[0]) return functions.sendInteractionEmbed(interaction, pendingApplication.author.name, pendingApplication.author.icon_url, pendingApplication.author.url, pendingApplication.title, pendingApplication.description, pendingApplication.fields, pendingApplication.footer.text, pendingApplication.footer.icon_url, pendingApplication.thumbnail, pendingApplication.image, pendingApplication.timestamp);

                connection.query(`INSERT INTO applications (userid, id, type, status) VALUES (?, ?, ?, ?)`, [interaction.user.id, id, type.toLowerCase(), 'pending'], function (error) { if (error) return console.error(error); });
                functions.sendInteractionEmbed(interaction, applicationStarted.author.name, applicationStarted.author.icon_url, applicationStarted.url, applicationStarted.title, applicationStarted.description, applicationStarted.fields, applicationStarted.footer.text, applicationStarted.icon_url, applicationStarted.thumbnail, applicationStarted.image, applicationStarted.timestamp);

                let collectCounter = 0;
                let endCounter = 0;

                const channelToSend = client.channels.cache.get(appChannel)

                const filter = (m) => m.author.id == interaction.user.id;
                const startApp = await functions.sendEmbed(interaction.member, sendQuestion.author.name, sendQuestion.author.icon_url, sendQuestion.author.url, addPlaceholders(sendQuestion.title, { questionNumber: collectCounter + 1 }), addPlaceholders(sendQuestion.description, { question: questions[collectCounter++] }), sendQuestion.fields, sendQuestion.footer.text, sendQuestion.footer.icon_url, sendQuestion.thumbnail, sendQuestion.image, sendQuestion.timestamp);

                const collector = startApp.channel.createMessageCollector({ filter });
                collector.on('collect', () => {
                    if (collectCounter < questions.length) {
                        functions.sendEmbed(startApp.channel, sendQuestion.author.name, sendQuestion.author.icon_url, sendQuestion.author.url, addPlaceholders(sendQuestion.title, { questionNumber: collectCounter + 1 }), addPlaceholders(sendQuestion.description, { question: questions[collectCounter++] }), sendQuestion.fields, sendQuestion.footer.text, sendQuestion.footer.icon_url, sendQuestion.thumbnail, sendQuestion.image, sendQuestion.timestamp);
                    } else {
                        functions.sendEmbed(startApp.channel, applicationFinished.author.name, applicationFinished.author.icon_url, applicationFinished.author.url, applicationFinished.title, applicationFinished.description, applicationFinished.fields, applicationFinished.footer.text, applicationFinished.footer.icon_url, applicationFinished.thumbnail, applicationFinished.image, applicationFinished.timestamp);
                        collector.stop('application finished');
                    };
                });

                collector.on('end', (collected, reason) => {
                    if (reason == 'application finished') {
                        let index = 1;
                        const mappedResponses = collected.map((msg) => {
                            return addPlaceholders(newApplication.description, { number: index++, question: questions[endCounter++], answer: msg.content, n: '\n' })
                        }).join('\n\n');
                        functions.sendEmbed(channelToSend, addPlaceholders(newApplication.author.name, { author: `${interaction.user.username}#${interaction.user.discriminator}` }), newApplication.author.icon_url, newApplication.author.url, newApplication.title, mappedResponses, newApplication.fields, addPlaceholders(newApplication.footer.text, { id: id }), newApplication.footer.icon_url, newApplication.thumbnail, newApplication.image, newApplication.timestamp);
                    };
                });
            });
        } catch (error) {
            if (settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };

    },
};