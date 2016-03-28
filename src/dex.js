/**
 *
 * The main dexjs module.
 *
 * @module dex
 * @name dex
 *
 * @requires d3
 * @requires jquery
 * @requires jquery-ui
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
dex.version = "0.7";

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

/**
 *
 * A module for dealing with arrays.
 *
 * @name array
 * @type {module:dex.array}
 *
 */
dex.array = require('./array/array');

/**
 * A module for dealing with colors.
 *
 * @name color
 * @type {module:dex.color}
 *
 */
dex.color = require("./color/color");

/**
 *
 * A module for configuring things.
 *
 * @name config
 * @type {module:dex.config}
 *
 */
dex.config = require("./config/config");

/**
 *
 * A module for logging to the console.
 *
 * @name console
 * @type {module:dex.console}
 *
 */
dex.console = require("./console/console");

/**
 *
 * A module for handling CSV data structures.
 *
 * @name csv
 * @type {module:dex.csv}
 *
 */
dex.csv = require("./csv/csv");

/**
 *
 * A module providing utilities for data generation.
 *
 * @name datagen
 * @type {module:dex.datagen}
 *
 */
dex.datagen = require("./datagen/datagen");

/**
 *
 * A module for dealing with JSON data.
 *
 * @name json
 * @type {module:dex.json}
 *
 */
dex.json = require("./json/json");

/**
 * A module for dealing with matrices.
 *
 * @name matrix
 * @type {module:dex/matrix}
 *
 */
dex.matrix = require("./matrix/matrix");

/**
 * @module dex/object
 */
dex.object = require("./object/object");

/**
 *
 * A module for creating ui components such as players and sliders.
 *
 * @name ui
 * @type {module:ui}
 *
 */
dex.ui = require("./ui/ui");

/**
 *
 * A module for dealing dex components.
 *
 * @name component
 * @type {module:component}
 *
 */
dex.component = require("./component/component");

/**
 *
 * An overall charting module composed of many sub-modules.
 *
 * @name charts
 * @type {module:charts}
 *
 */
dex.charts = require("./charts/charts");

module.exports = dex;