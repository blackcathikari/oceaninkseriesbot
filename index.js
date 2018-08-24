// This allows us to use ES6 modules. That's all. 

require = require('esm')(module);
module.exports = require('./src/seriesbot.js');