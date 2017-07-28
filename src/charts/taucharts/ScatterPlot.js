/**
 *
 * This module provides a TauCharts Line Chart.
 *
 * @name dex/charts/taucharts/LineChart
 *
 * @param userConfig
 * @returns LineChart
 */
var linechart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#TauCharts_LineChart',
    'id': 'TauCharts_LineChart',
    'class': 'TauCharts_LineChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'line'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.taucharts.TauChart(combinedConfig);

  return chart;
};
module.exports = linechart;