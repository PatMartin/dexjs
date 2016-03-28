/**
 *
 * This module provides ui components from a variety of sources.
 *
 * @module dex/ui
 * @name ui
 * @memberOf dex
 *
 */
var ui = {};

/**
 *
 * A module for creating ui components such as players and sliders.
 *
 * @name jqueryui
 * @type {module:jqueryui}
 *
 */
ui.jqueryui = require("./jqueryui/jqueryui");
ui.SqlQuery = require("./SqlQuery");
ui.Table = require("./Table");
ui.TypesTable = require("./TypesTable");

module.exports = ui;