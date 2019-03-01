/**
 *
 * This is the base constructor for a C3 Pie Chart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {DonutChart}
 *
 * @memberof dex/charts/c3
 *
 */
var PieChart = function (userConfig) {
  var defaults = {
    'parent': '#C3_PieChart',
    'id': 'C3_PieChart',
    'class': 'C3_PieChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type": "pie"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = PieChart;