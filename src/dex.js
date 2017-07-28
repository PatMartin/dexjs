/**
 *
 * @type {dex}
 *
 */
var dex = window.dexlibs || window.dexbootstrap || window.dexjquery || {};

dex.exception = {};

dex.exception.SpecificationException = function (spec, assessment) {
  this.spec = spec;
  this.assessment = assessment;
  this.name = spec.name;
  this.expected = assessment.expected;
  this.received = assessment.received;
};

/**
 * This routine will return an array with the specified range.
 *
 * @param {number} length - The length of the generated array.  ie: The number of numbers to generate.
 *
 * @example
 * dex.range(5); // returns [ 0, 1, 2, 3, 4 ]
 *
 * @returns {Array} The specified range expressed as an array.
 *
 * @memberof dex
 *
 */
/**
 * This routine will return an array with the specified range.
 *
 * @param {number} start - The starting number.
 * @param {number} length - The length of the generated array.  ie: The number of numbers to generate.
 *
 * @example
 * dex.range(10, 4); // returns [ 10, 11, 12, 13 ]
 *
 * @returns {Array} The specified range expressed as an array.
 *
 * @memberof dex
 *
 */
/**
 * This routine will return an array with the specified range.
 *
 * @param {number} start - The starting number.
 * @param {number} length - The length of the generated array.  ie: The number of numbers to generate.
 * @param {number} step - The step increment between numbers.
 *
 * @example
 * dex.range(100, 4, 10); // returns [ 100, 110, 120, 130 ]
 * dex.range(100, 5, -10); // returns [ 100, 90, 80, 70, 60 ]
 *
 * @returns {Array} The specified range expressed as an array.
 *
 * @memberOf dex
 *
 */
dex.range = function () {
  switch (arguments.length) {
    case 1:
      return _.range(0, arguments[0]);
    case 2:
      return _.range(arguments[0], arguments[0] + arguments[1]);
    case 3:
      return _.range(arguments[0],
        arguments[0] + (arguments[1] * arguments[2]),
        arguments[2]);
    default:
      return [];
  }
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
    return function (msg) {
      dest.attr('csv', msg.selected).update();
    }
  }
};

dex.createComponent = function (config) {
  return dex.executeFunctionByName(config.class, window, config.config);
};

dex.create = function (config) {
  var components = [];
  var cmap = {};
  config.components.forEach(function (component) {
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

dex.array = require('./array/array')(dex);
dex.color = require("./color/color")(dex);
dex.config = require("./config/config")(dex);
dex.console = require("./console/console")(dex);
dex.csv = require("./csv/csv");
dex.datagen = require("./datagen/datagen")(dex);
dex.geometry = require("./geometry/geometry")(dex);
dex.json = require("./json/json")(dex);
dex.matrix = require("./matrix/matrix")(dex);
dex.object = require("./object/object")(dex);
dex.ui = require("./ui/ui")(dex);
dex.ui.BootstrapSlider = dexbootstrap.slider;
dex.util = require('./util/util')(dex);

dex.component = require("./component/component")(dex);

dex.data = {};
dex.data.spec = require("./data/spec")(dex);

dex.charts = require("./charts/charts")(dex);

d3 = dex.charts.d3.d3v3;

// This fixes a JQueryUI/Bootstrap icon conflict.
if ($.fn.button.noConflict != undefined) {
  $.fn.button.noConflict();
}

module.exports = dex;