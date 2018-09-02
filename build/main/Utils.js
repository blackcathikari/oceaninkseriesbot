// @ts-ignore
import { Option } from '@ephox/katamari';
var isRoleTag = function (tag) {
    return tag.startsWith('<@&') && tag.charAt(tag.length - 1) === '>';
};
var getRoleIdFromTag = function (tag) {
    return isRoleTag(tag) ? Option.some(tag.slice(3, tag.length - 1)) : Option.none();
};
var roleExistsById = function (guild, id) {
    return guild.roles.find(function (role) { return role.id === id; });
};
var roleExistsByTag = function (guild, tag) {
    return getRoleIdFromTag(tag).map(function (id) { return roleExistsById(guild, id); }).isSome();
};
var hasRoleByid = function (member, id) {
    return member.roles.find(function (role) { return role.id === id; });
};
var hasRoleByTag = function (member, tag) {
    return getRoleIdFromTag(tag).map(function (id) { return hasRoleByid(member, id); }).isSome();
};
export default {
    roleExistsByTag: roleExistsByTag,
    hasRoleByTag: hasRoleByTag
};
