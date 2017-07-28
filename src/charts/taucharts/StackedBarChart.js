/**
 *
 * This is the base constructor for a TauChart StackedBarChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {StackedBarChart}
 *
 * @memberof dex/charts/taucharts
 *
 */
var StackedBarChart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#TauCharts_StackedBarChart',
    'id': 'TauCharts_StackedBarChart',
    'class': 'TauCharts_StackedBarChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'stacked-bar'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.taucharts.TauChart(combinedConfig);

  return chart;
};
module.exports = StackedBarChart;