/**
 *
 * This module provides a ECharts Single Axis ScatterPlot.
 *
 * @name dex/charts/echarts/SingleAxisScatterPlot
 *
 * @param userConfig
 * @returns SingleAxisScatterPlot
 */
var singleaxisscatterplot = function (userConfig) {
  var chart;
  var sizeScale = undefined;

  var defaults = {
    'parent': '#ECharts_SingleAxisScatterPlot',
    'id': 'ECharts_LineChart',
    'class': 'ECharts_LineChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'single-axis',
    'radius': {'min': 1, 'max': 50},
    'sizeMethod': 'linear',
    'sizeScale': function (value) {
      if (typeof sizeScale == "undefined") {
        dex.console.log("EXTENT", dex.csv.extent(chart.config.csv, [2]));
        sizeScale = dex.csv.getScalingMethod(
          chart.config.csv, chart.config.sizeMethod,
          dex.csv.extent(chart.config.csv, [2]),
          [chart.config.radius.min, chart.config.radius.max]);
      }
      return sizeScale(value);
    },
    'palette': 'category10',
    'series.coordinateSystem': 'singleAxis',
    'series.symbol': 'circle',
    'series.type': 'scatter',
    'series.itemStyle': {
      normal: {
        shadowBlur: 10,
        shadowColor: 'rgba(150, 36, 50, 0.5)',
        shadowOffsetY: 5,
        color: function (item) {
          return new echarts.graphic.RadialGradient(0.7, 0.5, 1, [{
            offset: .3,
            color: dex.color.palette[chart.config.palette][
            item.seriesIndex % dex.color.palette[
              chart.config.palette].length],
          }, {
            offset: 1,
            color: 'black'
          }])
        }
      }
    },
    "options": {
      dataZoom: [
        {
          handleSize: '100%',
          filterMode: 'empty',
          singleAxisIndex: dex.range(0, dex.csv.uniqueArray(csv, 0).length)
        }
      ],
      tooltip: {
        formatter: function(d) {
          return "<table><tr><td><b>" + csv.header[1] + ":</b></td><td>" +
              d.data[0] + "</td></tr><tr><td><b>" + csv.header[2] +
              ":</b></td><td>" + d.data[1] + "</td></tr></table>";
        }
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Single Axis ScatterPlot Settings",
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
              "name": "Minimum Symbol Size",
              "description": "The minimum size of the symbols",
              "type": "int",
              "target": "radius.min",
              "minValue": 0,
              "maxValue": 100,
              "initialValue": 5
            },
            {
              "name": "Maximum Symbol Size",
              "description": "The maximum size of the symbols",
              "type": "int",
              "target": "radius.max",
              "minValue": 0,
              "maxValue": 100,
              "initialValue": 50
            },
            {
              "name": "Size Scaling Method",
              "description": "The type of scaling method",
              "type": "choice",
              "target": "sizeMethod",
              "choices" : [ "linear", "pow", "log", "sqrt", "time" ],
              "initialValue": "linear"
            },
            {
              "name": "Color Scheme",
              "description": "The color scheme.",
              "target": "palette",
              "type": "choice",
              "choices": dex.color.colormaps({shortlist:true}),
              "initialValue": "category10"
            },
            {
              "name": "Series Type",
              "description": "The series type",
              "type": "choice",
              "target": "series.type",
              "choices": [ "scatter", "effectScatter" ]
            }
          ]
        },
        dex.config.gui.echartsItemStyle({name: "Item Style"}, "series.itemStyle.normal"),
        dex.config.gui.echartsItemStyle({name: "Item Style (Emphasis)"}, "series.itemStyle.emphasis"),
        dex.config.gui.echartsLabel({name: "Label"}, "series.label.normal"),
        dex.config.gui.echartsLabel({name: "Label (Emphasis)"}, "series.label.emphasis")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  return chart;
};
module.exports = singleaxisscatterplot;