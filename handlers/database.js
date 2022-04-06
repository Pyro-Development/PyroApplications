const mysql = require('mysql');
const settings = require('../handlers/YAML.js').loadSettings();

const connection = mysql.createConnection(settings.database.mysql);

connection.connect(function (error) {

    if (error) {
        if(settings.client.debug == true) return console.error(error);
        return console.log('\x1b[35mERROR \x1b[37m» \x1b[35mAn error has occured, please create a ticket in https://discord.gg/xYsDx6kbX7');
    };

    console.log(`\x1b[35mLOADER \x1b[37m» \x1b[35mSuccessfully connected to the database`);
});


module.exports = connection;