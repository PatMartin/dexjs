/**
 *
 * This module provides a TauCharts Scatterplot.
 *
 * @name dex/charts/taucharts/ScatterPlot
 *
 * @param userConfig
 * @returns ScatterPlot
 */
var scatterplot = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#TauCharts_ScatterPlot',
    'id': 'TauCharts_ScatterPlot',
    'class': 'TauCharts_ScatterPlot',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'scatterplot'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.taucharts.TauChart(combinedConfig);

  return chart;
};
module.exports = scatterplot;