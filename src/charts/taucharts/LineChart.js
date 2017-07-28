/**
 *
 * This is the base constructor for a TauChart LineChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {LineChart}
 *
 * @memberof dex/charts/taucharts
 *
 */
var LineChart = function (userConfig) {
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
module.exports = LineChart;