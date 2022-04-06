const settings = require('../handlers/YAML.js').loadSettings();
const lang = require('../handlers/YAML.js').loadLanguage();
const connection = require('../handlers/database.js');

async function sendEmbed(channel, authorName, authorIconURL, authorURL, title, description, fields, footerText, footerIconURL, thumbnail, image, timestamp, files, components) {
    return channel.send({
        embeds: [{
            author: {
                name: authorName,
                icon_url: authorIconURL || '',
                url: authorURL || ''
            },
            color: settings.branding.server_embed_color,
            title: title,
            description: description,
            fields: fields || [],
            footer: {
                text: footerText || settings.branding.server_embed_footer,
                icon_url: footerIconURL || settings.branding.server_icon_url
            },
            thumbnail: {
                url: thumbnail || ''
            },
            image: {
                url: image || ''
            },
            timestamp: (timestamp) ? new Date() : '' || new Date(),
        }],
        files: files || [],
        components: components || []
    }).catch(error => {
        if (error) {
            if(settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };
    });
};

async function editEmbed(message, authorName, authorIconURL, authorURL, title, description, fields, footerText, footerIconURL, thumbnail, image, timestamp, files, components) {
    return message.edit({
        embeds: [{
            author: {
                name: authorName,
                icon_url: authorIconURL || '',
                url: authorURL || ''
            },
            color: settings.branding.server_embed_color,
            title: title,
            description: description,
            fields: fields || [],
            footer: {
                text: footerText || settings.branding.server_embed_footer,
                icon_url: footerIconURL || settings.branding.server_icon_url
            },
            thumbnail: {
                url: thumbnail || ''
            },
            image: {
                url: image || ''
            },
            timestamp: (timestamp) ? new Date() : '' || new Date(),
        }],
        files: files || [],
        components: components || []
    }).catch(error => {
        if (error) {
            if(settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };
    });
}

async function sendInteractionEmbed(interaction, authorName, authorIconURL, authorURL, title, description, fields, footerText, footerIconURL, thumbnail, image, timestamp, files, components) {
    return interaction.editReply({
        embeds: [{
            author: {
                name: authorName,
                icon_url: authorIconURL || '',
                url: authorURL || ''
            },
            color: settings.branding.server_embed_color,
            title: title,
            description: description,
            fields: fields || [],
            footer: {
                text: footerText || settings.branding.server_embed_footer,
                icon_url: footerIconURL || settings.branding.server_icon_url
            },
            thumbnail: {
                url: thumbnail || ''
            },
            image: {
                url: image || ''
            },
            timestamp: (timestamp) ? new Date() : '' || new Date(),
        }],
        files: files || [],
        components: components || []
    }).catch(error => {
        if (error) {
            if(settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };
    });
};

function randomString(chars, length) {
    let mask = '';
    let result = '';

    try {
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';

        for (let i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];

        return result;
    } catch (error) {
        if (error) {
            if(settings.client.debug == true) return console.error(error);
            return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
        };
    };
};

module.exports = {
    sendEmbed: sendEmbed,
    editEmbed: editEmbed,
    sendInteractionEmbed: sendInteractionEmbed,
    randomString: randomString
}