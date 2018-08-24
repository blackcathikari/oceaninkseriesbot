import { Option } from '@ephox/katamari';

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
    return getRoleIdFromTag(tag).map((id) => hasRoleByid(member, id)).isSome();
};

export default {
    roleExistsByTag,
    hasRoleByTag
}