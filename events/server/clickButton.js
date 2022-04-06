const functions = require('../../resources/functions');
const connection = require('../../handlers/database.js');

module.exports = {
    name: 'interactionCreate',
    enabled: true,
    async execute(client, interaction) {

        const member = interaction.guild.members.cache.get(interaction.user.id);
        if(!member) return;

        if (!interaction.isButton()) return;
        
        await interaction.deferReply();

    },
};