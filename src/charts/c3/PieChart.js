/**
 *
 * This module provides a C3 Pie Chart.
 *
 * @name dex/charts/c3/PieChart
 *
 * @param userConfig
 * @returns PieChart
 */
var piechart = function (userConfig) {
  var defaults = {
    'parent': '#C3_PieChart',
    'id': 'C3_PieChart',
    'class': 'C3_PieChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type": "pie"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = piechart;