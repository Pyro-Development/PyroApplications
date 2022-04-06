const settings = require('../../handlers/YAML.js').loadSettings();

module.exports = {
	name: 'ready',
	enabled: true,
	execute(client) {

		console.log(`\x1b[35m${settings.branding.prefix} \x1b[37m» \x1b[35mLogged in as ${client.user.tag}`);

		client.user.setActivity(settings.activity.text, { type: settings.activity.type });
	},
};