/**
 *
 * This module provides a C3 Donut Chart.
 *
 * @name dex/charts/c3/DonutChart
 *
 * @param userConfig
 * @returns DonutChart
 */
var donutchart = function (userConfig) {
  var defaults = {
    'parent': '#C3_DonutChart',
    'id': 'C3_DonutChart',
    'class': 'C3_DonutChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type": "donut"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = donutchart;