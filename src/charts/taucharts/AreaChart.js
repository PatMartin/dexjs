/**
 *
 * This is the base constructor for a TauChart AreaChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {AreaChart}
 *
 * @memberof dex/charts/taucharts
 *
 */
var AreaChart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#TauCharts_AreaChart',
    'id': 'TauCharts_AreaChart',
    'class': 'TauCharts_AreaChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'area'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.taucharts.TauChart(combinedConfig);

  return chart;
};
module.exports = AreaChart;