/**
 *
 * This module provides ui components from a variety of sources.
 *
 * @module dex/ui
 * @name ui
 * @memberOf dex
 *
 */

/**
 *
 * A module for creating ui components such as players and sliders.
 *
 * @name jqueryui
 * @type {module:jqueryui}
 *
 */
module.exports = function ui(dex) {

  return {
    'jqueryui'  : require("./jqueryui/jqueryui")(dex),
    'SqlQuery'  : require("./SqlQuery"),
    'Table'     : require("./Table"),
    'TypesTable': require("./TypesTable")
  };
};