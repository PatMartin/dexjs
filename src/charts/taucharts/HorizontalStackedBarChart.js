/**
 *
 * This is the base constructor for a TauChart HorizontalStackedBarChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {HorizontalStackedBarChart}
 *
 * @memberof dex/charts/taucharts
 *
 */
var HorizontalStackedBarChart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#TauCharts_HorizontalStackedBarChart',
    'id': 'TauCharts_HorizontalStackedBarChart',
    'class': 'TauCharts_HorizontalStackedBarChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'horizontal-stacked-bar'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.taucharts.TauChart(combinedConfig);

  return chart;
};
module.exports = HorizontalStackedBarChart;