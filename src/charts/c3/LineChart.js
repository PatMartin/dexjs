/**
 *
 * This module provides a C3 Line Chart.
 *
 * @name dex/charts/c3/LineChart
 *
 * @param userConfig
 * @returns LineChart
 */
var linechart = function (userConfig) {
  var defaults = {
    'parent': '#C3_LineChart',
    'id': 'C3_LineChart',
    'class': 'C3_LineChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type": "line"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = linechart;