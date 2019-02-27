var dexlibs = window.dexbootstrap || window.dexjquery || {};

// Dependencies:

dexlibs.bus = require("../lib/pubsub");
dexlibs.moment = require("../lib/moment/moment");
dexlibs.promise = require("../lib/bluebird/bluebird");
module.exports = dexlibs;