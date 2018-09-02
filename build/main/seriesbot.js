/*
 * Beta Oceanink Series bot.
 * Version: 0.1
 * Invite link: https://discordapp.com/oauth2/authorize?client_id=482458671838789633&scope=bot
*/
// @ts-ignore
import { Client } from 'discord.js';
import Help from './Help';
import Management from './Management';
// set up discord client
var client = new Client();
var token = 'NDgyNDU4NjcxODM4Nzg5NjMz.DmFMxw.5bseRogeSuuJYM_X0tj7kWdS9JU';
// const botId = 'Oceanink Series Bot#8187';
client.on('ready', function () {
    console.log('Ready!');
});
var fallbackMessage = function (msg) { return msg.channel.send('Unknown command'); };
client.on('message', function (message) {
    if (message.content.startsWith('!s')) {
        console.log(message.content);
        var args = message.content.slice('!s '.length).split(' ');
        switch (args[0]) {
            case 'help':
                message.channel.send(Help.getHelpText(args.slice(1)));
                break;
            case 'manage':
                Management.manage(message, args.slice(1));
                break;
            default:
                fallbackMessage(message);
        }
    }
});
client.login(token);
