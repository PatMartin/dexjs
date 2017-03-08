/**
 *
 * This module provides a C3 ScatterPlot
 *
 * @name dex/charts/c3/ScatterPlot
 *
 * @param userConfig
 * @returns ScatterPlot
 */
var scatterplot = function (userConfig) {
  var defaults = {
    'parent': '#C3_ScatterPlot',
    'id': 'C3_ScatterPlot',
    'class': 'C3_ScatterPlot',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type": "scatter"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = scatterplot;