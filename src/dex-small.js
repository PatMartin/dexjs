/**
 *
 * This is the top level module for dexjs.
 *
 * @module dex
 *
 */
var dex = {
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
  copy: function (obj) {
    return _.copy(obj);
  }
};

/**
 * @namespace
 */
dex.array = require('./array/array')(dex);
dex.color = require("./color/color")(dex);

module.exports = dex;