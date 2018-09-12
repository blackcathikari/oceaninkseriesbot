# Oceanink Series Bot

## Overview

1. Match scheduling
    1.1. Team management
2. Stream Team organisation
3. Score reporting
4. Logging

### Stretch Goals

1. Rule/info help?
2. Challonge integration
3. Report who won which game in a match, and give teams stats on maps and modes?
4. Timezone conversion feature (for relevant timezones at least)
5. Team profiles

### Considerations

- Bot command prefix should be...?
    - For now it is `!s`

## TODO Notes

- Make default values for Globals / make Globals value persistent so I don't have to set admin perms every time
- sendMsg should be global?
- helpMsg should be global?
    - default second arg to first if not supplied?
- Make decision on whether roles and such stored in data should be stored as tags, ids, or both

## Features

### 0. Bot Help

- Help command should be added for every other command

### 1. Match Scheduling

Allows captains to submit their match times without admin oversight, and save match times locally so the list for each week can be accessed by admins, stream team, etc.

**Features**

- Captains can schedule matches for the current week, or deferred week
- Captains can defer matches
- Captains can bring up a list of their deferred matches, and schedule deferred matches from there

**Restrictions**

- Only captains can schedule matches
- Captains can only schedule matches for teams they have roles for
- Captains can only schedule matches in the relevant channel
- Matches are scheduled by a captain of one team participating in the match
- Matches must be confirmed by the captain of the other team
    - Ping them asking to confirm
- Captains should only be able to schedule matches for the current week, or deferred matches from previous weeks

**Considerations**

- Bot will need to keep track of who it's talking to for certain commands, since they will require whole conversations, rather than just being singular commands. Need to work out how to do this.

#### 1.1. Team Management

- Captain roles must be assigned manually by admins
- Captains can add/remove team roles themselves?
    - A user can only ever have one team role at a time
- Division roles are automatically given based on team role
- Bot can return a list of all members of a team
    - Only usable by admins and relevant captains?
        - Team captain, other div captains, all captains?
- Co-captain roles?

**Requirements**

- Bot must have a list of all teams roles
- Bot needs a list of team-div assignments for automatic div roles
- Lots of permissions
