// Allow user to override, but define this by default:

/**
 *
 * The main dexjs module.
 *
 * @module dex
 *
 * @requires d3
 * @requires jquery
 * @requires jqueryui
 * @requires underscore
 *
 * @property {string}              version   - Returns the version of dex.js being used.
 * @property {module:dex/bus}      bus       - A module providing a communication bus for charts.
 * @property {module:dex/array}    array     - A module for dealing with arrays.
 * @property {module:dex/csv}      csv       - A module for dealing with csv.
 * @property {module:dex/matrix}   matrix    - A module for dealing with matrices.
 * @property {module:dex/object}   object    - A module for dealing with objects.
 * @property {module:dex/charts}   charts    - The module which provides the various charts.
 * @property {module:dex/color}    color     - A module for dealing with colors.
 * @property {module:dex/datagen}  datagen   - A module for generating data.
 * @property {module:dex/json}     json      - A module for dealing with json.
 * @property {module:dex/charts}   ui        - A module providing ui components.
 * @property {dex/component} component - The base class for all charting components.
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
dex.copy = function (obj) {
  return _.copy(obj);
};

dex.executeFunctionByName = function (functionName, context) {
  var args = [].slice.call(arguments).splice(2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
};

dex.actions = {
  'setSelected': function (src, dest) {
    return function(msg) {
      dest.attr('csv', msg.selected).update();
    }
  }
};

dex.create = function (config) {
  var components = [];
  var cmap = {};
  dex.console.log("Creating Config:", config);
  config.components.forEach(function (component) {
    dex.console.log("COMPONENT:", component);
    cmap[component.name] = dex.executeFunctionByName(component.class, window, component.config);
    components.push(cmap[component.name]);
  });

  if (config.interactions != undefined) {
    config.interactions.forEach(function (interaction) {
      interaction.sources.forEach(function (source) {
        interaction.destinations.forEach(function (destination) {
          cmap[destination].subscribe(cmap[source], interaction.event,
            dex.actions[interaction.action](cmap[source], cmap[destination]));
        })
      })
    })
  }

  return components;
};

dex.render = function (config) {
  var components = dex.create(config);
  components.forEach(function (component) {
    component.render();
  });
  return components;
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
 * @type {module:dex.matrix}
 *
 */
dex.matrix = require("./matrix/matrix")(dex);

/**
 * @name object
 * @type {module:object}
 *
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

d3 = dex.charts.d3.d3v3;

// Allow jqueryui to play well with bootstrap.  This
// also means we must include dex.js before bootstrap.
$.widget.bridge('uitooltip', $.ui.tooltip);
$.widget.bridge('uibutton', $.ui.button);

module.exports = dex;