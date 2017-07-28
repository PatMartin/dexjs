/**
 *
 * This module provides a C3 StackedBar Chart.
 *
 * @name dex/charts/c3/StackedBarChart
 *
 * @param userConfig
 * @returns StackedBarChart
 *
 * @memberof dex/charts/c3
 *
 */
var StackedBarChart = function (userConfig) {
  var chart;

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
  chart = dex.charts.c3.C3Chart(combinedConfig);

  return chart;
};

module.exports = StackedBarChart;