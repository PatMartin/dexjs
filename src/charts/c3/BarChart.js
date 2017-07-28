/**
 *
 * This is the base constructor for a C3 Bar Chart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {BarChart}
 *
 * @memberof dex/charts/c3
 *
 */
var BarChart = function (userConfig) {
  var defaults = {
    'parent': '#C3_BarChart',
    'id': 'C3_BarChart',
    'class': 'C3_BarChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type": "bar"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = BarChart;