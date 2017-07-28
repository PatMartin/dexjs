/**
 *
 * This is the base constructor for a TauChart ScatterPlot.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {ScatterPlot}
 *
 * @memberof dex/charts/taucharts
 *
 */
var ScatterPlot = function (userConfig) {
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
module.exports = ScatterPlot;