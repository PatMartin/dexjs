/**
 *
 * This module provides a C3 StackedArea Chart.
 *
 * @name dex/charts/c3/StackedAreaChart
 *
 * @param userConfig
 * @returns StackedAreaChart
 *
 * @memberof dex/charts/c3
 *
 */
var StackedAreaChart = function (userConfig) {
  var defaults = {
    'parent': '#C3_StackedAreaChart',
    'id': 'C3_StackedAreaChart',
    'class': 'C3_StackedAreaChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "stack" : true,
    "options": {
      "data.type": "area"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = StackedAreaChart;