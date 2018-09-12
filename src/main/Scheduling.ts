// @ts-ignore
import { Arr } from '@ephox/katamari';
import Globals from '../data/Globals';
import Utils from '../util/Utils';
// @ts-ignore
import { RichEmbed } from 'discord.js';

const globals = () => Globals.getGlobals();

const areMatchesEqual = (match1, match2) => {
  return (match1.teams[0] === match2.teams[0] && match1.teams[1] === match2.teams[1])
      || (match1.teams[0] === match2.teams[1] && match1.teams[1] === match2.teams[0]);
};

const addMatch = (msg, args) => {
  const week = parseInt(args[0]);
  const team1 = args[1];
  const team2 = args[2];
  const matchTime = args[3]; // TODO: check this is a valid date somehow?

  if (!Utils.roleExistsByTag(msg.guild, team1) || !Utils.roleExistsByTag(msg.guild, team2)) {
    Utils.sendMsg(msg, 'You may only schedule matches for teams with valid roles. Please check what you typed.');
    return;
  }

  if (!Utils.hasRoleByTag(msg.member, team1) && !Utils.hasRoleByTag(msg.member, team2)) {
    Utils.sendMsg(msg, 'You may only schedule matches for teams you are a member of. Please check your roles and contact an admin if they need correcting.');
    return;
  }

  const weekMatches = globals().weeks[week];
  if (weekMatches == undefined || weekMatches === null) {
    Utils.sendMsg(msg, 'Invalid week value. Use `!s help schedule add` to check usage.');
    return;
  }

  // TODO: there's definitely a better way to do this
  const matchingMatches = Arr.exists(weekMatches, (match) => areMatchesEqual(match, {teams: [team1, team2]}));
  if (matchingMatches) {
    globals().weeks[week] = Arr.map(weekMatches, (match) => {
      if (areMatchesEqual(match, {teams: [team1, team2]})) {
        match.datetime = matchTime;
        match.datetimeBy = msg.member;
        Utils.sendMsg(msg, `Added tentative match time for ${team1} vs ${team2} for ${matchTime}. Awaiting confirmation by the other team.`);
      }
      return match;
    });
    return;
  }
  Utils.sendMsg(msg, `Can not find match between ${team1} and ${team2} for week ${week}. Please check what you typed, and use \`!s help schedule add\` to check usage.`);
  return;
};

const confirmMatch = (msg, args) => {
  // TODO: check user is captain of team they're adding a match time for, but not the captain who added the match
  console.log(args);

  // find match in globals, check it has a time, and confirm it if so

  // pull time from data and ask user to confirm match
};

const listMatches = (msg, args) => {
  const week = args[0];
  const weekMatches = globals().weeks[week];
  if (weekMatches == undefined || weekMatches === null) {
    Utils.sendMsg(msg, 'Invalid week value. Use `!s help schedule add` to check usage.');
    return;
  }

  let confirmedMatches = [];
  let tentativeMatches = [];
  let unscheduledMatches = [];
  Arr.each(weekMatches, (match) => {
    const confirmed = match.confirmed;
    const datetime = match.datetime;
    if (datetime !== null) {
      // TODO: format date better. make a util function?
      const text = `- ${new Date(match.datetime)}: ${match.teams[0]} vs. ${match.teams[1]}`;
      confirmed ? confirmedMatches.push(text) : tentativeMatches.push(text);
    } else {
      unscheduledMatches.push(`- ${match.teams[0]} vs. ${match.teams[1]}`);
    }
  });

  let msgText = '';
  if (confirmedMatches.length > 0) msgText += '\nConfirmed matches:\n' + confirmedMatches.join('\n');
  if (tentativeMatches.length > 0) msgText += '\nTentative matches:\n' + tentativeMatches.join('\n');
  if (unscheduledMatches.length > 0) msgText += '\nUnscheduled matches:\n' + unscheduledMatches.join('\n');

  Utils.sendMsg(msg, new RichEmbed()
    .setTitle('Match Schedule for Week ' + week)
    .setColor(0x003399)
    .setDescription(msgText)
  );
}


const schedule = (msg, args) => {
  const childArgs = args.slice(1);

  switch (args[0]) {
    case 'add': addMatch(msg, childArgs); break;
    case 'confirm': confirmMatch(msg, childArgs); break;
    case 'list': listMatches(msg, childArgs); break;
    default:
  }
};

export default {
  schedule
}