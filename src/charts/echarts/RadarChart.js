/**
 *
 * This module provides a ECharts Steam Graph.
 *
 * @name dex/charts/echarts/SteamGraph
 *
 * @param userConfig
 * @returns SteamGraph
 */
var steamgraph = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_SteamGraph',
    'id': 'ECharts_SteamGraph',
    'class': 'ECharts_SteamGraph',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'xIndex': 1,
    'yIndex': 2,
    'seriesIndex': 0,
    'type': 'steam',
    "options": {}
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Steam Graph Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
          ]
        },
        dex.config.gui.echartsLabel({name: "Normal Label"}, "series.label.normal"),
        dex.config.gui.echartsLabel({name: "Emphasis Label"}, "series.label.emphasis")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  return chart;
};
module.exports = steamgraph;