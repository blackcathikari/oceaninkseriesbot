
/*
    Various functions for managing the bot
*/

import { Fun } from '@ephox/katamari';
import Globals from './data/Globals.js';
import Utils from './Utils.js';

const sendMsg = (msg, text) => msg.channel.send(text);
const globals = () => Globals.getGlobals();

const adminManagement = (msg, args) => {
    const helpMsg = () => sendMsg(msg, 'Invalid admin command. Use `!s help manage admin` to check usage.');

    const setAdminRole = () => {
        // CHECK: number of args - 'set' and role name
        if (args.length !== 2) {
            helpMsg();
            return;
        }

        // RESTRICTION: Can only be used by the server owner
        if (msg.member !== msg.guild.owner) {
            sendMsg(msg, 'Admin role can only be seted by the owner of the server');
            return;
        }

        // CHECK: role actually exists
        if (Utils.roleExistsByTag(msg.guild, args[1])) {
            globals().adminRole = args[1];
            sendMsg(msg, 'Admin role is now ' + args[1]);
            return;
        }
        
        helpMsg();
    };

    const checkAdminRole = () => {
        const adminRole = globals().adminRole;
        adminRole === '' ? sendMsg(msg, 'No admin role has been set') : sendMsg(msg, 'Admin role is ' + adminRole);
    };

    switch (args[0]) {
        case 'set': setAdminRole(); break;
        case 'check': checkAdminRole(); break;
        default: helpMsg();
    }
};

const addTeamRoles = (args) => {
    // If a role exists, add it to the list of team roles
    // Get names of roles that exist, and report them back as successes
    // Keep any args that aren't team roles, and report those back as failures
};

const removeTeamRole = Fun.noop();

const cleanTeamRoles = () => {
    // PREREQ: Confirm
};

const setDivRoles = Fun.noop();

const setDivRole = Fun.noop();

const manage = (msg, args) => {
    // RESTRICTION: Can only be used by admins and server owner
    const adminRole = globals().adminRole;
    const isAdmin = adminRole !== '' && Utils.hasRoleByTag(msg.member, adminRole);
    if (msg.member !== msg.guild.owner || isAdmin) {
        sendMsg(msg, 'Management commands can only be used by the server owner and admins.');
        return;
    }

    // CHECK: number of args - at least admin/teams/divs and branch arg
    if (args.length < 2) {
        // Not enough args for any of these functions, so return bad args message
        sendMsg(msg, 'Not enough arguments for a management command. Use `!s help manage` to check usage.');
        return;
    }
    const option = args[0];
    switch (option) {
        case 'admin': adminManagement(msg, args.splice(1)); break;
        default: sendMsg(msg, 'Incorrect arguments');
    }
};

export default {
    manage
}