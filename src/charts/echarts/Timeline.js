/**
 *
 * This module provides a ECharts Timeline.
 *
 * @name dex/charts/echarts/Timeline
 *
 * @param userConfig
 * @returns Timeline
 */
var timeline = function (userConfig) {
  var chart;
  var sizeScale = d3.scale.linear();

  var defaults = {
    'parent': '#ECharts_Timeline',
    'id': 'ECharts_Timeline',
    'class': 'ECharts_Timeline',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'timeline',
    'radius' : { min: 5, max: 50 },
    categories: function (row) {
      return row[3];
    },
    sequences: function (row) {
      return +row[4];
    },
    sizes: function (row) {
      //dex.console.log("SIZING ROW: ", row);
      return chart.config.sizeScale(+row[2]);
    },
    'series.type': 'timeline',
    "options": {
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  var sizeExtents = dex.csv.extent(chart.config.csv, [2]);

  sizeScale.domain(sizeExtents)
    .range([+chart.config.radius.min, +chart.config.radius.max]);

  chart.config.sizeScale = sizeScale;

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Timeline Settings",
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
              "choices": ["emptyCircle", "circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow"],
              "target": "series.symbol",
              "initialValue": "emptyCircle"
            },
            {
              "name": "Symbol Size",
              "description": "The size of the symbols",
              "type": "int",
              "target": "series.symbolSize",
              "minValue": 0,
              "maxValue": 50,
              "initialValue": 5
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
module.exports = timeline;