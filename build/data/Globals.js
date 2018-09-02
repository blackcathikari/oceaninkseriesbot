/*
    I'd like this to be a database at some point, but this will do for now
*/
var globals = {
    adminRole: '',
    teamRoles: [],
    divRoles: []
};
export default {
    getGlobals: function () { return globals; }
};
