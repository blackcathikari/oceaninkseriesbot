// This allows us to use ES6 modules. That's all.

// @ts-ignore
const require = require('esm')(module);
// @ts-ignore
module.exports = require('./main/seriesbot.js');