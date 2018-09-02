/*
    I'd like this to be a database at some point, but this will do for now
*/

const globals = {
    adminRole: '',
    teamRoles: [],
    divRoles: []
};

export default {
    getGlobals: () => globals
}