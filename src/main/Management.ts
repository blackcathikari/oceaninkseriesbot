/*
    Various functions for managing the bot
*/

// @ts-ignore
import { Arr } from '@ephox/katamari';
import Globals from '../data/Globals.js';
import Utils from '../util/Utils';
import defaults from '../../defaults';

const globals = () => Globals.getGlobals();

const adminManagement = (msg, args) => {
    const setAdminRole = () => {
        // CHECK: number of args - 'set' and role name
        if (args.length !== 2) {
            Utils.sendHelpMsg(msg, 'manage admin set');
            return;
        }

        // RESTRICTION: Can only be used by the server owner
        if (msg.member !== msg.guild.owner) {
            Utils.sendMsg(msg, 'Admin role can only be seted by the owner of the server');
            return;
        }

        // CHECK: role actually exists
        if (Utils.roleExistsByTag(msg.guild, args[1])) {
            globals().adminRole = args[1];
            Utils.sendMsg(msg, 'Admin role is now ' + args[1]);
            return;
        }

        Utils.sendHelpMsg(msg, 'manage admin set');
    };

    const checkAdminRole = () => {
        const adminRole = globals().adminRole;
        adminRole === '' ? Utils.sendMsg(msg, 'No admin role has been set') : Utils.sendMsg(msg, 'Admin role is ' + adminRole);
    };

    switch (args[0]) {
        case 'set': setAdminRole(); break;
        case 'check': checkAdminRole(); break;
        default: Utils.sendHelpMsg(msg, 'manage admin');
    }
};

const teamManagement = (msg, args) => {
    // TODO: add a function to check no person in the server has more than 1 team role?
    switch (args[0]) {
        case 'add': Utils.addRoles(msg, args, 'manage', 'teamRoles', 'team'); break;
        case 'remove': Utils.removeRoles(msg, args, 'manage', 'teamRoles', 'team'); break;
        case 'removeAll': Utils.removeAllRoles(msg, 'teamRoles', 'team'); break;
        case 'list': Utils.listRoles(msg, 'teamRoles', 'team'); break;
        default: Utils.sendHelpMsg(msg, 'manage teams');
    }
};

const divManagement = (msg, args) => {
    switch (args[0]) {
        case 'add': Utils.addRoles(msg, args, 'manage', 'divRoles', 'div'); break;
        case 'remove': Utils.removeRoles(msg, args, 'manage', 'divRoles', 'div'); break;
        case 'removeAll': Utils.removeAllRoles(msg, 'divRoles', 'div'); break;
        case 'list': Utils.listRoles(msg, 'divRoles', 'div'); break;
        default: Utils.sendHelpMsg(msg, 'manage divs');
    }
};

const seriesManagement = (msg, args) => {

    const setNumWeeks = (num) => {
        // TODO: check num is a number
        globals().numWeeks = parseInt(num);
        Utils.sendMsg(msg, 'Set number of weeks in season to ' + parseInt(num));
    };

    const setStartDate = (format, date) => {
        // TODO: check date is a valid date
        // TODO: support other datetime formats (currently ISO 8601 and milliseconds only) and timezones (currently AEST)
        const datetime = new Date(format === 'iso' ? date + '+10:00' : date);
        globals().startDate = datetime.valueOf(); // stores as milliseconds since Jan 1, 1970
        Utils.sendMsg(msg, 'Set start date to ' + datetime);
    };

    // TODO: make these get and set functions
    switch (args[0]) {
        case 'numWeeks': setNumWeeks(args[1]); break;
        case 'startDate': setStartDate(args[1], args[2]); break;
        default: Utils.sendHelpMsg(msg, 'manage series');
    }
};

const weekManagement = (msg, args) => {
    const makeMatch = (teamData) => {
        // TODO: check team roles are registered
        // TODO: check for duplicate matches
        const teams = teamData.split(' ');
        return {
            teams,
            datetime: null, // TODO: make these options!
            datetimeBy: '', // TODO: make this an interface somewhere!
            confirmed: false,
            confirmedBy: ''
        };
    };

    const setMatches = (week, rawMatches) => {
        const matches = Arr.map(rawMatches.join(' ').split('- '), (teamData) => makeMatch(teamData.trim()));
        globals().weeks[week] = matches;
    };

    switch (args[0]) {
        case 'matches': setMatches(args[1], args.slice(2)); break;
        default: Utils.sendHelpMsg(msg, 'manage weeks');
    }
};

const quickInit = (msg) => {
    adminManagement(msg, ['set', defaults.adminRole]);
    teamManagement(msg, ['add'].concat(defaults.teamRoles));
    divManagement(msg, ['add'].concat(defaults.divRoles));
    seriesManagement(msg, ['numWeeks', defaults.numWeeks]);
    seriesManagement(msg, ['startDate', 'ms', defaults.startDate]);
};

const manage = (msg, args) => {
    // RESTRICTION: Can only be used by admins and server owner
    const adminRole = globals().adminRole;
    const isAdmin = adminRole !== '' && Utils.hasRoleByTag(msg.member, adminRole);
    if (msg.member !== msg.guild.owner && !isAdmin) {
        Utils.sendMsg(msg, 'Management commands can only be used by the server owner and admins.');
        return;
    }

    // CHECK: number of args - at least admin/teams/divs and branch arg
    if (args.length < 2 && args[0] !== 'quickinit') {
        // Not enough args for any of these functions, so return bad args message
        Utils.sendMsg(msg, 'Not enough arguments for a management command. Use `!s help manage` to check usage.');
        return;
    }
    const option = args[0];
    const childArgs = args.slice(1);
    switch (option) {
        case 'quickinit': quickInit(msg); break;
        case 'admin': adminManagement(msg, childArgs); break;
        case 'teams': teamManagement(msg, childArgs); break;
        case 'divs': divManagement(msg, childArgs); break;
        case 'series': seriesManagement(msg, childArgs); break;
        case 'weeks': weekManagement(msg, childArgs); break;
        default: Utils.sendMsg(msg, 'Incorrect arguments');
    }
};

export default {
    manage
}