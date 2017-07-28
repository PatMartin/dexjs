/**
 *
 * This is the base constructor for a TauChart BarChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {BarChart}
 *
 * @memberof dex/charts/taucharts
 *
 */
var BarChart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#TauCharts_BarChart',
    'id': 'TauCharts_BarChart',
    'class': 'TauCharts_BarChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'bar'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.taucharts.TauChart(combinedConfig);

  return chart;
};
module.exports = BarChart;