const fs = require('fs');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const settings = require('./YAML.js').loadSettings();

const commands = [];

module.exports.loadEvents = (client) => {

    try {
        const dirs = fs.readdirSync('./events');
        for (const dir of dirs) {
            const eventFiles = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));

            for (const file of eventFiles) {
                const event = require(`../events/${dir}/${file}`);
                if (event.enabled) {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                    console.log(`\x1b[35mLOADER \x1b[37m» \x1b[35mSuccessfully loaded the event: ${file}`);
                };
            };
        };
    } catch (error) {
        if (error) {
            if(settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };
    };
};

module.exports.loadCommands = (client) => {
    try {

        const dirs = fs.readdirSync('./commands');
        for (const dir of dirs) {
            const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/${dir}/${file}`);
                if (command.enabled) {
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                    console.log(`\x1b[35mLOADER \x1b[37m» \x1b[35mSuccessfully loaded the command: ${file}`);
                }
            }

        }

        const rest = new REST({ version: '9' }).setToken(settings.client.token);

        (async () => {
            try {

                settings.client.guildid.forEach(async guildid => {
                    await rest.put(
                        Routes.applicationGuildCommands(settings.client.clientid, guildid),
                        { body: commands },
                    );
                });

                console.log(`\x1b[35mLOADER \x1b[37m» \x1b[35mSuccessfully loaded application (/) commands.`);
            } catch (error) {
                if (error) {
                    if(settings.client.debug == true) return console.error(error);
                    return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
                };
            };
        })();

    } catch (error) {
        if (error) {
            if(settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };
    };
};