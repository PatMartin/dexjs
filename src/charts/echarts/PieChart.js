/**
 *
 * This module provides a ECharts Pie Chart
 *
 * @name dex/charts/echarts/PieChart
 *
 * @param userConfig
 * @returns PieChart
 */
var piechart = function (userConfig) {
  var chart;
  var sizeScale = undefined;
  var defaults = {
    'parent': '#ECharts_PieChart',
    'id': 'ECharts_PieChart',
    'class': 'ECharts_PieChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'pie',
    'seriesIndex': 0,
    'nameIndex': 1,
    'valueIndex': 2,
    'aggregationMethod': "Sum",
    'aggregationFunction': function (values) {
      return values.reduce(function (acc, value) {
        return acc + value;
      }, 0);
    },
    // Dynamic but can be overriden.
    maxPadding: undefined,
    maxPercent: undefined,
    radius: undefined,
    padding: undefined,
    'series.type': 'pie',
    'series.selectedMode': 'single',
    'series.label.normal.position': 'inner'
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.subscribe(chart, "attr", function (event) {
    if (event.attr == "aggregationMethod") {
      switch (event.value) {
        case "Average": {
          chart.config.aggregationFunction = function (values) {
            var sum = values.reduce(function (acc, value) {
              return acc + value;
            }, 0);
            return sum / values.length;
          }
        }
        case "Count": {
          chart.config.aggregationFunction = function (values) {
            return values.length;
          }
        }
        case "Count Distinct": {
          chart.config.aggregationFunction = function (values) {
            return dex.array.unique(values).length;
          }
        }
        case "Sum":
        default: {
          chart.config.aggregationFunction = function (values) {
            return values.reduce(function (acc, value) {
              return acc + value;
            }, 0);
          }
        }
      }
    }
  });

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Pie Chart Settings",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            {
              "name": "Aggregation Method",
              "description": "The aggregation method",
              "type": "choice",
              "choices": ["Sum", "Average", "Count", "Count Distinct"],
              "target": "aggregationMethod",
              "initialValue": "Sum"
            }
          ]
        },
        {
          "type": "group",
          "name": "Series and Axis",
          "contents": [
            {
              "name": "Series Index",
              "description": "The series index.",
              "type": "choice",
              "choices": chart.config.csv.header,
              "target": "seriesIndex"
            },
            {
              "name": "Name Index",
              "description": "The radius index.",
              "type": "choice",
              "choices": chart.config.csv.header,
              "target": "nameIndex"
            },
            {
              "name": "Value Index",
              "description": "The value index.",
              "type": "choice",
              "choices": chart.config.csv.header,
              "target": "valueIndex"
            }
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  return chart;
};
module.exports = piechart;