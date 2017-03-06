/**
 *
 * This module provides a C3 Area Chart.
 *
 * @name dex/charts/c3/AreaChart
 *
 * @param userConfig
 * @returns AreaChart
 */
var areachart = function (userConfig) {
  var defaults = {
    'parent': '#C3_AreaChart',
    'id': 'C3_AreaChart',
    'class': 'C3_LineChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {
      "data.type" : "area-spline"
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  return dex.charts.c3.C3Chart(combinedConfig);
};

module.exports = areachart;