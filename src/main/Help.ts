// @ts-ignore
import { Obj, Arr } from '@ephox/katamari';
// @ts-ignore
import { RichEmbed } from 'discord.js';

const managementBranches: any = {
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
            removeAll: { text: 'Clears the team roles list entirely. Use carefully.' },
            list: { text: 'List which roles are in the team roles list.', }
        }
    },
    divs: {
        text: 'Add and remove div roles.',
        branches: {
            add: {
                text: 'Add one or more div roles to the list. Note: must be valid roles.',
                usage: '@div-1 @div-2'
            },
            remove: {
                text: 'Remove one or more div roles from the list. Note: must be valid roles.',
                usage: '@div-1 @div-2'
            },
            removeAll: { text: 'Clears the div roles list entirely. Use carefully.' },
            list: { text: 'LIst which roles are in the div roles list.', }
        }
    },
    series: {
        text: 'Manage Series data',
        branches: {
            numWeeks: {
                text: 'Set how many week the Series will run for',
                usage: '5'
            },
            startDate: {
                text: 'Set the starting date and time of the Series season. For now, only supports ISO-8601 datetime format and AEST.',
                usage: '2019-09-10T09:00:00'
            }
        }
    },
    weeks: {
        text: 'For managing week-to-week things',
        branches: {
            matches: {
                text: 'Set the matches that will occur in each week',
                usage: `1
- @team-a @team-b
- @team-c @team-d`
            }
        }
    },
    schedule: {
        text: 'For scheduling matches',
        branches: {
            add: {
                text: 'For adding matches to the schedule. Note that matches are not locked in until they are confirmed by the captain of the other team. You may only add match times for teams you have the correct roles for.',
                usage: '1 @team-a @team-b 2019-09-10T09:00:00'
            },
            confirm: {
                text: 'For confirming matches. The bot will tell you when the match is tentatively scheduled for, and ask you to confirm with "yes" or "no"',
                usage: '1 @team-a @team-b'
            },
            list: {
                text: 'List all the matches for a given week',
                usage: '1'
            }
        }
    }
};

const helpData = {
    text: 'A bot designed for the Oceanink Series. Use `!s help list` for a full list of all commands, or `!s help <command>` for details about each command.\n',
    branches: {
        manage: {
            text: 'Commands for managing the bot. Only useable by the server owner and specified admins.',
            branches: managementBranches
        }
    }
};

const generateHelpText = (args) => {
    const parseLeaf = (name, leaf, pathLength) => {
        const usage = () => '\nUsage: `!s ' + args.slice(0, args.length-pathLength).join(' ') + ` ${name} ` + leaf.usage + '`';
        return leaf.hasOwnProperty('usage') ? leaf.text + usage() : leaf.text;
    };

    const isLeaf = (obj) => !obj.hasOwnProperty('branches');

    const parseNonLeaf = (block): string => {
        // TODO: surely there's more to this?
        return block.text;
    };

    const parseBlock = (block, pathLength) => {
        const generateLine = (name, text) => '\n- **' + name + ':** ' + text;
        const keys = Obj.keys(block);
        const descriptions = Arr.map(keys, (key) => {
            const child = block[key];
            return isLeaf(child) ? generateLine(key, parseLeaf(key, child, pathLength)) : generateLine(key, parseNonLeaf(child));
        });
        return descriptions.join('');
    };

    const traverse = (obj, path) => {
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

const generateFullList = () => {
    const traverse = (obj, prefix) => {
        if (obj.hasOwnProperty('branches')) {
            const keys = Obj.keys(obj.branches);
            return Arr.map(keys, (key) => {
                const newPrefix = prefix.concat([key]);
                return traverse(obj.branches[key], newPrefix);
            }).join('\n');
        }

        return '- `' + prefix.join(' ') + '`: ' + obj.text;
    };

    return traverse(helpData, ['!s']);
};

const getHelpText = (args) => {
    let text = '';
    if (args[0] === 'list') {
        text = generateFullList();
    } else {
        text = generateHelpText(args);
    }
    const embed = new RichEmbed()
        .setTitle('Oceanink Series Bot Help')
        .setColor(0x003399)
        .setDescription(text);
    return embed;
};

export default {
    getHelpText
}