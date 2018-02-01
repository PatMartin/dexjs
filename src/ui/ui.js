module.exports = function (dex) {
  /**
   *
   * This module provides various ui components.
   *
   * @module dex/ui
   *
   */
  var ui = {};

  ui.Player = require("./Player");
  ui.SqlQuery = require("./SqlQuery");
  ui.Table = require("./Table");
  ui.ConfigurationPane = require("./ConfigurationPane");
  ui.DataFilterPane = require("./DataFilterPane");
  ui.GuiPane = require("./GuiPane");
  ui.ColumnSelector = require("./ColumnSelector");
  return ui;
};