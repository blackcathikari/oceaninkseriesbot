/*
 * Beta Oceanink Series bot. 
 * Version: 0.1
 * Invite link: https://discordapp.com/oauth2/authorize?client_id=482458671838789633&scope=bot
*/

import { Option } from '@ephox/katamari';
import { Client } from 'discord.js';
const client = new Client();

// set up discord client
// const Discord = require('discord.js');
// const client = new Discord.Client();

const token = 'NDgyNDU4NjcxODM4Nzg5NjMz.DmFMxw.5bseRogeSuuJYM_X0tj7kWdS9JU';
const botId = 'Oceanink Series Bot#8187';

client.on('ready', () => {
    console.log('Ready!');
});

const fallbackMessage = (msg) => msg.channel.send('Unknown command');

client.on('message', (message) => {
    if (message.content.startsWith('!s')) {
        console.log(message.content);
        const args = message.content.slice(3).split(' ');
        switch (args[0]) {
            case 'help':
                console.log('help');
                getHelpText(args).fold(
                    () => fallbackMessage(message),
                    (reply) => message.channel.send(reply)
                );
                break;
            default: 
                fallbackMessage(message);
        }
    }
});

const getHelpText = (args) => {
    return Option.some(`Sorry, help isn't implemented yet`);
};

client.login(token);