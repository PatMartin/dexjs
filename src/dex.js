/**
 *
 * The main dexjs module.
 *
 * @module dex
 * @requires d3
 * @requires jquery
 * @requires jquery-ui
 * @requires underscore
 *
 */
var dex = {};

//require("d3");
//$ = require("jquery");
//require("jquery-ui");
//_ = require("underscore");

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
 * A module for dealing with arrays.
 *
 * @name array
 * @type {module:array}
 *
 */
dex.array = require('./array/array');

/**
 *
 * A module for configuring things.
 *
 * @name config
 * @type {module:config}
 *
 */
dex.config = require("./config/config");

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
 * A module for logging to the console.
 *
 * @name console
 * @type {module:console}
 *
 */
dex.console = require("./console/console");

/**
 * A module for dealing with colors.
 *
 * @name color
 * @type {module:color}
 *
 */
dex.color = require("./color/color");

/**
 *
 * A charting module.
 *
 * @name charts
 * @type {module:charts}
 *
 */
dex.charts = {'d3' : {'map' : {}},
  'c3'   : {},
  'dygraphs' : {},
  'd3plus'   : {},
  'google' : {},
  'handlebars' : {},
  'threejs' : {}};

/**
 *
 * A charting module.
 *
 * @name charts
 * @type {module:charts}
 *
 */
dex.ui = {'jqueryui' : {}};

/**
 *
 * A module for handling CSV data structures.
 *
 * @name csv
 * @type {module:csv}
 *
 */
dex.csv = require("./csv/csv");

/**
 *
 * A module providing utilities for data generation.
 *
 * @name datagen
 * @type {module:datagen}
 *
 */
dex.datagen = require("./datagen/datagen");

/**
 *
 * A module for dealing with JSON data.
 *
 * @name json
 * @type {module:json}
 *
 */
dex.json = require("./json/json");

/**
 * A module for dealing with matrices.
 *
 * @name matrix
 * @type {module:matrix}
 *
 */
dex.matrix = require("./matrix/matrix");

/**
 * A module for dealing with javascript objects.
 *
 * @name object
 * @type {module:object}
 *
 */
dex.object = require("./object/object");

/**
 *
 * A module for dealing dex components.
 *
 * @name component
 * @type {module:component}
 *
 */
dex.component = require("./component/component");

module.exports = dex;