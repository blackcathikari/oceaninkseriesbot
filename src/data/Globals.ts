/*
    I'd like this to be a database at some point, but this will do for now
*/

const globals = {
    adminRole: '',
    teamRoles: [],
    divRoles: [],
    numWeeks: 0,
    startDate: 0, // TODO: add the various deadlines
    weeks: {
        1: [
            {
            teams: ['<@&482502679390715905>', '<@&482502767139749923>'],
            datetime: null, // TODO: make these options!
            datetimeBy: '', // TODO: make this an interface somewhere!
            confirmed: false,
            confirmedBy: ''
            },{
            teams: ['<@&489381926499516416>', '<@&489381969046667266>'],
            datetime: null, // TODO: make these options!
            datetimeBy: '', // TODO: make this an interface somewhere!
            confirmed: false,
            confirmedBy: ''
            }
        ]
    }
};

export default {
    getGlobals: () => globals
}