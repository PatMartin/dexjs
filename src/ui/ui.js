module.exports = function (dex) {
  /**
   *
   * This module provides ui components.
   *
   * @module ui
   * @memberof dex
   *
   */
  var ui = {};

  ui.Player = require("./ui/Player");
  ui.SqlQuery = require("./ui/SqlQuery");
  ui.Table = require("./ui/Table");
  ui.ConfigurationPane = require("./ui/ConfigurationPane");
  ui.DataFilterPane = require("./ui/DataFilterPane");
  ui.GuiPane = require("./ui/GuiPane");

  return ui;
};