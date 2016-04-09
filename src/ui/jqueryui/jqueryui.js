/**
 *
 * This module provides ui components based upon jquery-ui.
 *
 * @module dex/ui/jqueryui
 * @name jqueryui
 * @memberOf dex.ui
 *
 */

module.exports = function jqueryui(dex) {
  return {
    'ConfigurationBox': require("./ConfigurationBox"),
    'Player': require("./Player"),
    'Selectable': require("./Selectable"),
    'Slider': require("./Slider"),
    'Tabs': require("./Tabs")
  };
};