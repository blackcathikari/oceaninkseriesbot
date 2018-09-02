// @ts-ignore
import { Obj, Arr } from '@ephox/katamari';
// @ts-ignore
import { RichEmbed } from 'discord.js';
var managementBranches = {
    admin: {
        text: 'Set and check the admin role.',
        branches: {
            set: {
                text: 'Specify a role to give people access to the management features of the bot. Note: currently requires the role name to be @ mentioned.',
                usage: '@admin'
            },
            check: { text: 'Check which role has admin permissions for the bot.' }
        }
    },
    teams: {
        text: 'Add and remove team roles.',
        branches: {
            add: {
                text: 'Add one or more team roles to the list. Note: must be valid roles.',
                usage: '@team-1 @team-2'
            },
            remove: {
                text: 'Remove one or more team roles from the list. Note: must be valid roles.',
                usage: '@team-1 @team-2'
            },
            removeall: { text: 'Clears the team roles list entirely. Use carefully.' },
            check: { text: 'Check which roles are in the team roles list.', }
        }
    }
};
var helpData = {
    text: 'A bot designed for the Oceanink Series. Use `!s help list` for a full list of all commands, or `!s help <command>` for details about each command.\n',
    branches: {
        manage: {
            text: 'Commands for managing the bot. Only useable by the server owner and specified admins.',
            branches: managementBranches
        }
    }
};
var generateHelpText = function (args) {
    var parseLeaf = function (name, leaf, pathLength) {
        var usage = function () { return '\nUsage: `!s ' + args.slice(0, args.length - pathLength).join(' ') + (" " + name + " ") + leaf.usage + '`'; };
        return leaf.hasOwnProperty('usage') ? leaf.text + usage() : leaf.text;
    };
    var isLeaf = function (obj) { return !obj.hasOwnProperty('branches'); };
    var parseNonLeaf = function (block) {
        // TODO: surely there's more to this?
        return block.text;
    };
    var parseBlock = function (block, pathLength) {
        var generateLine = function (name, text) { return '\n- **' + name + ':** ' + text; };
        var keys = Obj.keys(block);
        var descriptions = Arr.map(keys, function (key) {
            var child = block[key];
            return isLeaf(child) ? generateLine(key, parseLeaf(key, child, pathLength)) : generateLine(key, parseNonLeaf(child));
        });
        return descriptions.join('');
    };
    var traverse = function (obj, path) {
        // No path or we've hit the edge of the tree, so return wherever we are
        if (!(path.length > 0) || isLeaf(obj)) {
            return isLeaf(obj) ? parseLeaf('', obj, path.length) : obj.text + ' Options:' + parseBlock(obj.branches, path.length);
        }
        // Path is incorrect - return possibilities
        if (!obj.branches.hasOwnProperty(path[0])) {
            return path[0] + ' is a unknown command. Did you mean:' + parseBlock(obj.branches, path.length);
        }
        // Path is correct - traverse
        return traverse(obj.branches[path[0]], path.slice(1));
    };
    return traverse(helpData, args);
};
var generateFullList = function () {
    var traverse = function (obj, prefix) {
        if (obj.hasOwnProperty('branches')) {
            var keys = Obj.keys(obj.branches);
            return Arr.map(keys, function (key) {
                var newPrefix = prefix.concat([key]);
                return traverse(obj.branches[key], newPrefix);
            }).join('\n');
        }
        return '- `' + prefix.join(' ') + '`: ' + obj.text;
    };
    return traverse(helpData, ['!s']);
};
var getHelpText = function (args) {
    var text = '';
    if (args[0] === 'list') {
        text = generateFullList();
    }
    else {
        text = generateHelpText(args);
    }
    var embed = new RichEmbed()
        .setTitle('Oceanink Series Bot Help')
        .setColor(0x003399)
        .setDescription(text);
    return embed;
};
export default {
    getHelpText: getHelpText
};
