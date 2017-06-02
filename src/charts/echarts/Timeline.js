/**
 *
 * This module provides a ECharts Area Chart.
 *
 * @name dex/charts/echarts/AreaChart
 *
 * @param userConfig
 * @returns AreaChart
 */
var linechart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_LineChart',
    'id': 'ECharts_LineChart',
    'class': 'ECharts_LineChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'linechart',

    'series.symbol': 'circle',
    'series.symbolSize': 10,
    'series.type': 'line',
    'series.showSymbol': true,
    'series.showAllSymbol': false,
    'series.stack': false,
    'series.clipOverflow': true,
    'series.connectNulls': false,
    'series.step': false,
    "options": {
      tooltip: {
        formatter: 'Group {a}: ({c})'
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Line Chart Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Symbol Shape",
              "description": "The shape of the symbol.",
              "type": "choice",
              "choices": ["circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow"],
              "target": "series.symbol"
            },
            {
              "name": "Symbol Size",
              "description": "The size of the symbols",
              "type": "int",
              "target": "series.symbolSize",
              "minValue": 0,
              "maxValue": 50,
              "initialValue": 5
            },
            {
              "name": "Series Type",
              "description": "The series type",
              "type": "choice",
              "target": "series.type",
              "choices": ["line", "scatter", "scatterEmphasis", "bar"]
            },
            {
              "name": "Stack Series",
              "description": "Stack the series or not.",
              "type": "boolean",
              "target": "series.stack",
              "initialValue": false
            },
            {
              "name": "Clip Overflow",
              "description": "Clip overflow.",
              "type": "boolean",
              "target": "series.clipOverflow",
              "initialValue": true
            },
            {
              "name": "Connect Nulls",
              "description": "Connect nulls.",
              "type": "boolean",
              "target": "series.connectNulls",
              "initialValue": false
            },
            {
              "name": "Step",
              "description": "Stack the series or not.",
              "type": "boolean",
              "target": "series.step",
              "initialValue": false
            }
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
module.exports = linechart;