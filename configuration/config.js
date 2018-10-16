'use strict';
let fs = require('fs');
let path = require('path');

let config;
let obj = {};
module.exports = obj;

/**
 * return configuration
 */
obj.getConfig = function () {
    if (typeof config === "undefined"){
        config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8'));
    }
    return config;
}