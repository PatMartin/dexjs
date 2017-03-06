/**
 *
 * This module provides a C3 StackedBar Chart.
 *
 * @name dex/charts/c3/StackedBarChart
 *
 * @param userConfig
 * @returns StackedBarChart
 */
var stackedbarchart = function (userConfig) {
  var defaults = {
    'parent': '#C3_StackedBarChart',
    'id': 'C3_StackedBarChart',
    'class': 'C3_StackedBarChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "stack" : true,
    "options": {
      "data.type": "bar"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = stackedbarchart;