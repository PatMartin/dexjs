/**
 *
 * This module provides a ECharts Polar Plot
 *
 * @name dex/charts/echarts/PolarPlot
 *
 * @param userConfig
 * @returns PolarPlot
 */
var polarplot = function (userConfig) {
  var chart;
  var sizeScale = undefined;
  var defaults = {
    'parent': '#ECharts_PolarPlot',
    'id': 'ECharts_PolarPlot',
    'class': 'ECharts_PolarPlot',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'polar',
    'seriesIndex': 0,
    'angleIndex': 1,
    'valueIndex': 2,
    'radiusIndex': undefined,
    'radius': {'min': 1, 'max': 20},
    'sizeMethod': 'linear',
    'sizeScale': function (value) {
      // No size scale exists, so let's establish one.
      if (typeof sizeScale == "undefined") {
        // We have a value index to size upon.
        if (chart.config.valueIndex !== undefined) {
          sizeScale = dex.csv.getScalingMethod(
            chart.config.csv, chart.config.sizeMethod,
            dex.csv.extent(chart.config.csv,
              [dex.csv.getColumnNumber(chart.config.csv, chart.config.valueIndex)]),
            [chart.config.radius.min, chart.config.radius.max]);
        }
        // There is no value index to size upon. so we will try another
        // approach:
        //
        // 1. Create a csv which omits radius and angle indices from consideration
        // 2. Omit non-numerics as well.
        // 3. Get the extents from the remaining columns.
        // 4. Map these extents to a scale based on radius min/max range.
        else {
          var excludes = [];
          if (chart.config.radiusIndex != undefined) {
            excludes.push(dex.csv.getColumnNumber(chart.config.radiusIndex));
          }
          if (chart.config.angleIndex !== undefined) {
            excludes.push(dex.csv.getColumnNumber(chart.config.angleIndex));
          }
          var sizeCsv;
          if (excludes.length == 0) {
            sizeCsv = chart.config.csv;
          }
          else {
            sizeCsv = dex.csv.exclude(chart.config.csv, excludes);
          }
          var ncols = dex.csv.getNumericIndices(sizeCsv);
          var extents = dex.csv.extent(sizeCsv, ncols);
          dex.console.log("EXTENTS", extents);
          sizeScale = dex.csv.getScalingMethod(
            chart.config.csv, chart.config.sizeMethod, extents,
            [chart.config.radius.min, chart.config.radius.max]);
        }
      }
      // If an array, value index is always first.
      if (Array.isArray(value)) {
        return sizeScale(value[0]);
      }
      // If a simple value, size on it.  IE: Polar Bar Chart
      return sizeScale(value);
    },
    'series.coordinateSystem': 'polar',
    'series.type': 'line',
    'series.itemStyle.normal.opacity': .6,
    'series.itemStyle.emphasis.opacity': .9,
    "series.symbolSize": function (d) {
      //dex.console.log("SIZING D", d);
      if (typeof chart.config.sizeScale != "undefined") {
        //dex.console.log("SIZING D", d, chart.config.sizeScale(+d[2]));
        return chart.config.sizeScale(d);
      }
      return 5;
    },
    "options": {
      tooltip: {
        formatter: 'Group {a}: ({c})'
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.subscribe(chart, "attr", function (event) {
    if (event.attr == "radius" || event.attr == "sizeMethod" ||
      event.attr == "radius.min" || event.attr == "radius.max") {
      // Causes next call to sizeScale to recreate it.
      sizeScale = undefined;
    }

    if (event.attr == "valueIndex" && event.value == "none") {
      sizeScale = undefined;
    }
  });

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Polar Plot Settings",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            {
              "name": "Chart Type",
              "description": "The chart type.",
              "type": "choice",
              "choices": ["line", "bar", "scatter"],
              "target": "series.type"
            },
            dex.config.gui.echartsTitle({}, "options.title")
          ]
        },
        {
          "type": "group",
          "name": "Scaling",
          "contents": [
            {
              "name": "Minimum Radius",
              "description": "The minimum radius.",
              "type": "int",
              "minValue": 0,
              "maxValue": 200,
              "target": "radius.min",
              "initialValue": 5
            },
            {
              "name": "Maximum Radius",
              "description": "The maximum radius.",
              "type": "int",
              "minValue": 0,
              "maxValue": 200,
              "target": "radius.max",
              "initialValue": 5
            },
            {
              "name": "Size Scaling Method",
              "description": "The type of scaling method",
              "type": "choice",
              "target": "sizeMethod",
              "choices": ["linear", "pow", "log", "sqrt", "time"],
              "initialValue": "linear"
            }
          ]
        },
        {
          "type": "group",
          "name": "Series and Axis",
          "contents": [
            {
              "name": "Stack Series",
              "description": "To stack or not to stack, that is the question.",
              "type": "boolean",
              "target": "series.stack"
            },
            {
              "name": "Angle Axis Data Type",
              "description": "Angle axis data type.",
              "type": "choice",
              "choices": ["dynamic", "category"],
              "target": "angleAxisType"
            },
            {
              "name": "Radius Axis Data Type",
              "description": "Radius axis data type.",
              "type": "choice",
              "choices": ["dynamic", "category"],
              "target": "radiusAxisType"
            },
            {
              "name": "Value Index",
              "description": "The value index.",
              "type": "choice",
              "choices": dex.array.combine(["none"], chart.config.csv.header),
              "target": "valueIndex"
            },
            {
              "name": "Radius Index",
              "description": "The radius index.",
              "type": "choice",
              "choices": dex.array.combine(["none"], chart.config.csv.header),
              "target": "radiusIndex"
            },
            {
              "name": "Angle Index",
              "description": "The angle index.",
              "type": "choice",
              "choices": dex.array.combine(["none"], chart.config.csv.header),
              "target": "angleIndex"
            },
            {
              "name": "Series Index",
              "description": "The series index.",
              "type": "choice",
              "choices": dex.array.combine(["none"], chart.config.csv.header),
              "target": "seriesIndex"
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
module.exports = polarplot;