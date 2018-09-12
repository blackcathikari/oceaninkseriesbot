// @ts-ignore
import { Option, Arr } from '@ephox/katamari';
import Globals from '../data/Globals.js';

const globals = () => Globals.getGlobals();
const sendMsg = (msg, text) => msg.channel.send(text);
const sendHelpMsg = (msg, cmd) => sendMsg(msg, 'Invalid `' + cmd + '` command. Use `!s help ' + cmd + '` to check usage.');

const isRoleTag = (tag) => {
    return tag.startsWith('<@&') && tag.charAt(tag.length-1) === '>';
};

const getRoleIdFromTag = (tag) => {
    return isRoleTag(tag) ? Option.some(tag.slice(3, tag.length-1)) : Option.none();
};

const roleExistsById = (guild, id) => {
    return guild.roles.find((role) => role.id === id);
};

const roleExistsByTag = (guild, tag) => {
    return getRoleIdFromTag(tag).map((id) => roleExistsById(guild, id)).isSome();
};

const hasRoleByid = (member, id) => {
    return member.roles.find((role) => role.id === id);
};

const hasRoleByTag = (member, tag) => {
    return getRoleIdFromTag(tag).map((id) => hasRoleByid(member, id)).getOr(false);
};

const passFailMessage = (xs, predXs, passMsg, failMsg) => {
    const passFail = Arr.partition(xs, (_, i) => predXs[i]);
    const passPlural = passFail.pass.length > 1 ? 's' : '';
    const failPlural = passFail.fail.length > 1 ? 's' : '';
    const passText = passFail.pass.length > 0 ? passMsg + passPlural + ": " + passFail.pass.join(', ') : '';
    const failText = passFail.fail.length > 0 ? failMsg + failPlural + ": " + passFail.fail.join(', ') : '';
    return passText + (passText !== '' && failText !== '' ? '\n' : '') + failText;
};

const addRole = (msg, roles, newRole) => {
    // If a role exists and isn't a duplicate, add it to the list of roles
    if (roleExistsByTag(msg.guild, newRole) && !Arr.exists(roles, (role) => role === newRole)) {
        roles.push(newRole);
        return true;
    }
    return false;
};

const addRoles = (msg, args, helpMsgPrefix, globalRoleType, msgRoleType) => {
    // Get names of roles that were added, and report them back as successes
    // Keep any args that aren't roles, and report those back as failures

    const newRoles = args.slice(1);
    if (newRoles.length === 0) {
        sendHelpMsg(msg, `${helpMsgPrefix} ${msgRoleType}s add`);
        return;
    }

    const existingRoles = globals()[globalRoleType]

    const wasAdded = Arr.map(newRoles, (newRole) => addRole(msg, existingRoles, newRole));
    sendMsg(msg, passFailMessage(newRoles, wasAdded, `Added ${msgRoleType} role`, `Invalid ${msgRoleType} role`));
};

const removeRole = (roles, role) => {
    const ind = Arr.indexOf(roles, role);
    return ind.fold(() => false, (i) => {
        roles.splice(i, 1);
        return true;
    });
};

const removeRoles = (msg, args, helpMsgPrefix, globalRoleType, msgRoleType) => {
    const rolesToRemove = args.slice(1);
    if (rolesToRemove.length === 0) {
        sendHelpMsg(msg, `${helpMsgPrefix} ${msgRoleType}s remove`);
        return;
    }

    // TODO: check valid role
    const roles = globals()[globalRoleType];
    const wasRemoved = Arr.map(rolesToRemove, (role) => removeRole(roles, role));
    sendMsg(msg, passFailMessage(rolesToRemove, wasRemoved, `Removed ${msgRoleType} role`, `Invalid ${msgRoleType} role`));
};

const removeAllRoles = (msg, globalRoleType, msgRoleType) => {
    // PREREQ: Confirm
    // TODO
    globals()[globalRoleType] = [];
    sendMsg(msg, `All ${msgRoleType} roles have been removed`);
};

const listRoles = (msg, globalRoleType, msgRoleType) => {
    // TODO: formatting?
    const roles = globals()[globalRoleType];
    roles.length > 0 ? sendMsg(msg, 'Roles are: ' + roles.join(', ')) : sendMsg(msg, `No ${msgRoleType} roles have been set`);
};

export default {
    sendMsg,
    sendHelpMsg,
    passFailMessage,
    roleExistsByTag,
    hasRoleByTag,
    addRoles,
    removeRoles,
    removeAllRoles,
    listRoles
}