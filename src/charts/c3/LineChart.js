var linechart = function (userConfig) {
  var defaults = {
    'parent': '#LineChart',
    // Set these when you need to CSS style components independently.
    'id': 'LineChart',
    'class': 'LineChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    "options": {}
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  dex.console.log("COMBINED", combinedConfig);
  return dex.charts.c3.C3Chart(combinedConfig, defaults);
};

module.exports = linechart;