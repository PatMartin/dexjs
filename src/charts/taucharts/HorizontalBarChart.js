/**
 *
 * This is the base constructor for a TauChart HorizontalBarChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {HorizontalBarChart}
 *
 * @memberof dex/charts/taucharts
 *
 */
var HorizontalBarChart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#TauCharts_HorizontalBarChart',
    'id': 'TauCharts_HorizontalBarChart',
    'class': 'TauCharts_HorizontalBarChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'horizontal-bar'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.taucharts.TauChart(combinedConfig);

  return chart;
};
module.exports = HorizontalBarChart;