var dexlibs = window.dexbootstrap || window.dexjquery || {};

// Dependencies:
// https://github.com/federico-lox/pubsub.js
dexlibs.bus = require("../lib/pubsub");
dexlibs.moment = require("../lib/moment/moment");

module.exports = dexlibs;