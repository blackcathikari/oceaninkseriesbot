/*
    Various functions for managing the bot
*/
// @ts-ignore
import { Fun, Arr } from '@ephox/katamari';
import Globals from '../data/Globals.js';
import Utils from './Utils.js';
var sendMsg = function (msg, text) { return msg.channel.send(text); };
var globals = function () { return Globals.getGlobals(); };
var helpMsg = function (msg, cmd) { return sendMsg(msg, 'Invalid `manage ' + cmd + '` command. Use `!s help manage ' + cmd + '` to check usage.'); };
var adminManagement = function (msg, args) {
    var setAdminRole = function () {
        // CHECK: number of args - 'set' and role name
        if (args.length !== 2) {
            helpMsg(msg, 'admin set');
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
        helpMsg(msg, 'admin set');
    };
    var checkAdminRole = function () {
        var adminRole = globals().adminRole;
        adminRole === '' ? sendMsg(msg, 'No admin role has been set') : sendMsg(msg, 'Admin role is ' + adminRole);
    };
    switch (args[0]) {
        case 'set':
            setAdminRole();
            break;
        case 'check':
            checkAdminRole();
            break;
        default: helpMsg(msg, 'admin');
    }
};
var teamManagement = function (msg, args) {
    var passFailMessage = function (xs, predXs, passMsg, failMsg) {
        var passFail = Arr.partition(xs, function (_, i) { return predXs[i]; });
        var passPlural = passFail.pass.length > 1 ? 's' : '';
        var failPlural = passFail.fail.length > 1 ? 's' : '';
        var passText = passFail.pass.length > 0 ? passMsg + passPlural + ": " + passFail.pass.join(', ') : '';
        var failText = passFail.fail.length > 0 ? failMsg + failPlural + ": " + passFail.fail.join(', ') : '';
        return passText + (passText !== '' && failText !== '' ? '\n' : '') + failText;
    };
    var addTeamRole = function (roles, newRole) {
        // If a role exists and isn't a duplicate, add it to the list of team roles
        if (Utils.roleExistsByTag(msg.guild, newRole) && !Arr.exists(roles, function (role) { return role === newRole; })) {
            roles.push(newRole);
            return true;
        }
        return false;
    };
    var addTeamRoles = function () {
        // Get names of roles that were added, and report them back as successes
        // Keep any args that aren't team roles, and report those back as failures
        var newRoles = args.slice(1);
        if (newRoles.length === 0) {
            helpMsg(msg, 'teams add');
            return;
        }
        var existingRoles = globals().teamRoles;
        var wasAdded = Arr.map(newRoles, function (newRole) { return addTeamRole(existingRoles, newRole); });
        sendMsg(msg, passFailMessage(newRoles, wasAdded, 'Added team role', 'Invalid team role'));
    };
    var removeTeamRole = function (roles, role) {
        var ind = Arr.indexOf(roles, role);
        return ind.fold(function () { return false; }, function (i) {
            roles.splice(i, 1);
            return true;
        });
    };
    var removeTeamRoles = function () {
        var rolesToRemove = args.slice(1);
        if (rolesToRemove.length === 0) {
            helpMsg(msg, 'teams remove');
            return;
        }
        // TODO: check valid role
        var teamRoles = globals().teamRoles;
        var wasRemoved = Arr.map(rolesToRemove, function (role) { return removeTeamRole(teamRoles, role); });
        sendMsg(msg, passFailMessage(rolesToRemove, wasRemoved, 'Removed team role', 'Invalid team role'));
    };
    var removeAllTeamRoles = function () {
        // PREREQ: Confirm
        // TODO
        globals().teamRoles = [];
        sendMsg(msg, 'All team roles have been removed');
    };
    var checkTeamRoles = function () {
        // TODO: formatting?
        var roles = globals().teamRoles;
        roles.length > 0 ? sendMsg(msg, 'Team roles are: ' + roles.join(', ')) : sendMsg(msg, 'No team roles have been set');
    };
    switch (args[0]) {
        case 'add':
            addTeamRoles();
            break;
        case 'remove':
            removeTeamRoles();
            break;
        case 'removeall':
            removeAllTeamRoles();
            break;
        case 'check':
            checkTeamRoles();
            break;
        default: helpMsg(msg, 'teams');
    }
};
var divManagement = function (msg, args) {
    var setDivRoles = Fun.noop();
    var setDivRole = Fun.noop();
    switch (args[0]) {
        default: sendMsg(msg, 'Not implemented yet');
    }
};
var manage = function (msg, args) {
    // RESTRICTION: Can only be used by admins and server owner
    var adminRole = globals().adminRole;
    var isAdmin = adminRole !== '' && Utils.hasRoleByTag(msg.member, adminRole);
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
    var option = args[0];
    var childArgs = args.slice(1);
    switch (option) {
        case 'admin':
            adminManagement(msg, childArgs);
            break;
        case 'teams':
            teamManagement(msg, childArgs);
            break;
        case 'divs':
            divManagement(msg, childArgs);
            break;
        default: sendMsg(msg, 'Incorrect arguments');
    }
};
export default {
    manage: manage
};
