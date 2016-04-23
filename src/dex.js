// Allow user to override, but define this by default:

/**
 *
 * The main dexjs module.
 *
 * @module dex
 * @name dex
 *
 * @requires d3
 * @requires jquery
 * @requires jqueryui
 * @requires underscore
 *
 */
var dex = {};

/**
 *
 * The version of dexjs.
 *
 * @name version
 * @type {string}
 *
 */
dex.version = "0.8.0.8";

/**
 * This routine will return an array [ start, ..., start + len ] using an increment of 1.
 *
 * @param {number} start - The starting index.
 * @param {number} len - The number of integers to generate.
 * @example {@lang javascript}
 * // returns [ 0, 1, 2 ]
 * range(0, 3)
 *
 * @returns {Array} An array consisting of elements [ start, ..., start + len ].
 *
 */
dex.range = function (start, len) {
  return _.range(start, start + len);
};

/**
 *
 * This routine is simply a convenience function as it
 * simply wraps underscore's implementation of a shallow
 * copy.  This method will create a shallow-copied clone
 * of the provided plain object. Any nested objects or
 * arrays will be copied by reference, not duplicated.
 *
 * @param obj
 * @returns {*}
 */
dex.copy = function(obj) {
  return _.copy(obj);
};

/**
 *
 * The pub/sub bus used by dex in order to publish and subscribe to events.
 *
 * @name bus
 * @type {PubSub}
 * @see https://github.com/federico-lox/pubsub.js
 *
 */
dex.bus = require("../lib/pubsub");

require('../lib/d3.svg.multibrush');
require('../lib/d3.selection');

dex.pc = require('../lib/d3.parcoords');
dex.util = require('./util/util')(dex);

/**
 *
 * A module for dealing with arrays.
 *
 * @name array
 * @type {module:dex.array}
 *
 */
dex.array = require('./array/array')(dex);

/**
 * A module for dealing with colors.
 *
 * @name color
 * @type {module:dex.color}
 *
 */
dex.color = require("./color/color")(dex);

/**
 *
 * A module for configuring things.
 *
 * @name config
 * @type {module:dex.config}
 *
 */
dex.config = require("./config/config")(dex);

/**
 *
 * A module for logging to the console.
 *
 * @name console
 * @type {module:dex.console}
 *
 */
dex.console = require("./console/console")(dex);

/**
 *
 * A module for handling CSV data structures.
 *
 * @name csv
 * @type {module:dex.csv}
 *
 */
dex.csv = require("./csv/csv")(dex);

/**
 *
 * A module providing utilities for data generation.
 *
 * @name datagen
 * @type {module:dex.datagen}
 *
 */
dex.datagen = require("./datagen/datagen")(dex);

/**
 *
 * A module for dealing with JSON data.
 *
 * @name json
 * @type {module:dex.json}
 *
 */
dex.json = require("./json/json")(dex);

/**
 * A module for dealing with matrices.
 *
 * @name matrix
 * @type {module:dex/matrix}
 *
 */
dex.matrix = require("./matrix/matrix")(dex);

/**
 * @module dex/object
 */
dex.object = require("./object/object")(dex);

/**
 *
 * A module for creating ui components such as players and sliders.
 *
 * @name ui
 * @type {module:ui}
 *
 */
dex.ui = require("./ui/ui")(dex);

/**
 *
 * A module for dealing dex components.
 *
 * @name component
 * @type {module:component}
 *
 */
dex.component = require("./component/component")(dex);

/**
 *
 * An overall charting module composed of many sub-modules.
 *
 * @name charts
 * @type {module:charts}
 *
 */
dex.charts = require("./charts/charts")(dex);

module.exports = dex;