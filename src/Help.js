import { Option, Obj, Arr } from '@ephox/katamari';
import { RichEmbed } from 'discord.js';

const managementBranches = {
    admin: {
        text: 'Set and check the admin role.',
        branches: {
            set: { 
                text: 'Specify a role to give people access to the management features of the bot. Note: currently requires the role name to be @ mentioned.',
                usage: '@admin'
            },
            check: { text: 'Check which role has admin permissions for the bot.' }
        }
    }
};

const helpData = {
    text: 'A bot designed for the Oceanink Series.',
    branches: {
        manage: {
            text: 'Commands for managing the bot. Only useable by the server owner and specified admins.',
            branches: managementBranches
        }
    }
};

const generateHelpText = (args) => {
    const parseLeaf = (name, leaf) => {
        const usage = () => '\nUsage: `!s ' + args.join(' ') + ` ${name} ` + leaf.usage + '`';
        return leaf.hasOwnProperty('usage') ? leaf.text + usage() : leaf.text;
    };

    const isLeaf = (obj) => !obj.hasOwnProperty('branches');

    const parseNonLeaf = (block) => {
        // TODO
        // const keys = Obj.keys(block);
        return block.text;
    };

    const parseBlock = (block) => {
        const generateLine = (name, text) => '\n- **' + name + ':** ' + text;
        const keys = Obj.keys(block);
        const descriptions = Arr.map(keys, (key) => {
            const child = block[key];
            return isLeaf(child) ? generateLine(key, parseLeaf(key, child)) : generateLine(key, parseNonLeaf(child));
        });
        return descriptions.join('');
    };

    const traverse = (obj, path) => {
        // No path, so return top-level help
        if (path.length === 0) {
            return obj.text + ' Options:' + parseBlock(obj.branches);
        }

        // Path is incorrect - return possibilities
        if (!obj.branches.hasOwnProperty(path[0])) {
            return path[0] + ' is a unknown command. Did you mean:' + parseBlock(obj.branches);
        }

        // Path is correct - traverse
        return traverse(obj.branches[path[0]], path.slice(1));
    };
    
    return traverse(helpData, args);
};

const getHelpText = (args) => {
    const text = generateHelpText(args);
    const embed = new RichEmbed()
        .setTitle('Oceanink Series Bot Help')
        .setColor(0x003399)
        .setDescription(text);
    return embed;
};

export default {
    getHelpText
}