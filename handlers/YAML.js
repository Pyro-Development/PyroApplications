const yaml = require('js-yaml')
const fs = require('fs')
const chalk = require('chalk')

module.exports.loadLanguage = () => {
    try {
        return yaml.load(fs.readFileSync('./resources/lang.yml', 'utf8'))
    } catch (error) {
        const JSONError = JSON.parse(JSON.stringify(error));
        console.log(chalk.redBright(`Language Error! Turning off bot...\nLine: ${JSONError.mark.line} at position ${JSONError.mark.position}\n${JSONError.mark.snippet}`));
        process.exit(1);
    };
};

module.exports.commandSettings = () => {
    try {
        return yaml.load(fs.readFileSync('./resources/commands.yml', 'utf8'))
    } catch (error) {
        const JSONError = JSON.parse(JSON.stringify(error));
        console.log(chalk.redBright(`Language Error! Turning off bot...\nLine: ${JSONError.mark.line} at position ${JSONError.mark.position}\n${JSONError.mark.snippet}`));
        process.exit(1);
    };
};

module.exports.loadSettings = () => {
    try {
        return yaml.load(fs.readFileSync('./resources/settings.yml', 'utf8'))
    } catch (error) {
        const JSONError = JSON.parse(JSON.stringify(error));
        console.log(chalk.redBright(`Settings Error! Turning off bot...\nLine: ${JSONError.mark.line} at position ${JSONError.mark.position}\n${JSONError.mark.snippet}`));
        process.exit(1);
    };
};

module.exports.loadApplications = () => {
    try {
        return yaml.load(fs.readFileSync('./resources/applications.yml', 'utf-8'));
    } catch (error) {
        const JSONError = JSON.parse(JSON.stringify(error));
        console.log(chalk.redBright(`Settings Error! Turning off bot...\nLine: ${JSONError.mark.line} at position ${JSONError.mark.position}\n${JSONError.mark.snippet}`));
        process.exit(1);
    };
};