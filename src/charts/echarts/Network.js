/**
 *
 * This module provides a ECharts Network.
 *
 * @name dex/charts/echarts/network
 *
 * @param userConfig
 * @returns Network
 */
var network = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_Network',
    'id': 'ECharts_Network',
    'class': 'ECharts_Network',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'force',
    // Each node is a unique category
    'categories' : dex.csv.getCsvFunction(),
    'series.circular' : {},
    'series.type': 'graph',
    'series.layout': 'force',
    'series.force' : {
      repulsion: 50,
      gravity: .1,
      edgeLength: 100,
      layoutAnimation: true
    },
    "options": {
      title: {
        text: 'Title',
        subtext: 'Subtext',
        bottom: true,
        left: true
      },
      tooltip: {}
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Network Settings",
      "contents": [
        dex.config.gui.dimensions(),
        dex.config.gui.general(),
        {
          "type": "group",
          "name": "Miscellaneous",
          "contents": [
            {
              "name": "Layout",
              "description": "The shape of the symbol.",
              "type": "choice",
              "choices": ["force", "circular", "none"],
              "target": "series.layout",
              "initialValue": "force"
            },
            {
              "name": "Categorize",
              "description": "Categorization Methods",
              "type": "choice",
              "choices": Object.keys(dex.csv.getCategorizationMethods(csv)),
              "target": "categorizationMethod"
            },
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
              "name": "Node Scale Ratio",
              "description": "Affects mouse zoom increment.",
              "type": "float",
              "target": "series.nodeScaleZoom",
              "minValue": 0,
              "maxValue": 2,
              "initialValue": .6
            },
            {
              "name": "Draggable",
              "description": "Allow the network diagram to be dragged or not.",
              "type": "boolean",
              "target": "series.draggable",
              "initialValue": false
            }
          ]
        },
        {
          "type": "group",
          "name": "Force Layout",
          "contents": [
            {
              "name": "Initial Layout",
              "description": "Initial layout.",
              "type": "choice",
              "choices": ["circular", "random"],
              "target": "series.force.initLayout",
              "initialValue": "circular"
            },
            {
              "name": "Gravity",
              "description": "The gravitational factor.",
              "type": "float",
              "target": "series.force.gravity",
              "minValue": -10,
              "maxValue": 10,
              "initialValue": .1
            },
            {
              "name": "Repulsion",
              "description": "The repulsive force between nodes.",
              "type": "int",
              "target": "series.force.repulsion",
              "minValue": -1000,
              "maxValue": 1000,
              "initialValue": 50
            },
            {
              "name": "Edge Length",
              "description": "The distance between nodes before repulsion and gravity are applied.",
              "type": "int",
              "target": "series.force.edgeLength",
              "minValue": 0,
              "maxValue": 1000,
              "initialValue": 30
            },
            {
              "name": "Layout Animation",
              "description": "Show the iteration layout or not.",
              "type": "boolean",
              "target": "series.force.layoutAnimation",
              "initialValue": true
            }
          ]
        },
        dex.config.gui.echartsLineStyle({name: "Line Style"}, "series.lineStyle.normal"),
        dex.config.gui.echartsLineStyle({name: "Line Style (Emphasis)"}, "series.lineStyle.emphasis"),
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
module.exports = network;