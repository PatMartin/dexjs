/**
 *
 * Create an ECharts Polar Plot with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {PolarPlot} An ECharts Network configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var PolarPlot = function (userConfig) {
  var chart;
  var internalChart = undefined;
  var effectiveOptions;

  var defaults = {
    'parent': '#ECharts_PolarPlot',
    'id': 'ECharts_PolarPlot',
    'class': 'ECharts_PolarPlot',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'polar',
    'palette': 'ECharts',
    'refreshType': "update",
    'displayLegend': true,
    'radius': {'min': 5, 'max': 20},
    'sizeMethod': 'linear',
    'series.coordinateSystem': 'polar',
    'series.type': 'line',
    'series.itemStyle.normal.opacity': .6,
    'series.itemStyle.emphasis.opacity': .9,
    "options": {
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        trigger: 'item',
        formatter: function (d) {
          //dex.console.log("FORMATTER", d);
          var str = "<table class='dex-tooltip-table'>";

          str += "<th colspan='2'>" + d.seriesName + "</th>";
          d.data.forEach(function (value) {
            if (typeof value === "string") {
              var parts = value.split(":::");
              if (parts.length == 2) {
                str += "<tr><td>" + parts[0] + "</td><td>" + parts[1] + "</td></tr>";
              }
            }
          });
          str += "</table>";
          return str;
        }
      },
      dataZoom: [
        {
          orient: 'vertical',
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          angleAxisIndex: 0
        },
        {
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          radiusAxisIndex: 0
        }
      ]
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.spec = new dex.data.spec("Polar Chart")
    .any("series")
    .any("angle")
    .any("radius")
    .optionalNumber("size");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Polar Plot Settings",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            dex.config.gui.echartsLabelGroup({}, "series.label"),
            dex.config.gui.echartsGrid({}, "options.grid"),
            dex.config.gui.echartsTooltip({}, "options.tooltip"),
            dex.config.gui.echartsSymbol({}, "series"),
            {
              "name": "Chart Type",
              "description": "The chart type.",
              "type": "choice",
              "choices": ["line", "bar", "scatter"],
              "target": "series.type"
            },
            {
              "name": "Color Scheme",
              "description": "The color scheme.",
              "target": "palette",
              "type": "choice",
              "choices": dex.color.colormaps({shortlist: true}),
              "initialValue": "category10"
            },
            {
              "name": "Display Legend",
              "description": "Determines whether or not to draw the legend or not.",
              "type": "boolean",
              "target": "displayLegend",
              "initialValue": true
            },
            {
              "name": "Background Color",
              "description": "The color of the background.",
              "target": "options.backgroundColor",
              "type": "color",
              "initialValue": "#ffffff"
            },
            {
              "name": "Symbol Shape",
              "description": "The shape of the symbol.",
              "type": "choice",
              "choices": ["emptyCircle", "circle", "rect", "roundRect", "triangle", "diamond", "pin", "arrow"],
              "target": "series.symbol",
              "initialValue": "emptyCircle"
            }
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
            }
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var seriesInfo, radiusInfo, angleInfo, scaleInfo;
    var scaling = false;

    var csvSpec = chart.spec.parse(csv);

    var options = dex.config.expandAndOverlay(chart.config.options, {
        series: [],
        polar: {}
      },
      chart.getCommonOptions());
    var seriesNames;


    seriesInfo = csvSpec.specified[0];
    radiusInfo = csvSpec.specified[1];
    angleInfo = csvSpec.specified[2];

    chart.config.seriesInfo = seriesInfo;
    chart.config.radiusInfo = radiusInfo;
    chart.config.angleInfo = angleInfo;

    scaling = csvSpec.specified.length > 3 &&
      csvSpec.specified[3].type == "number";

    if (scaling) {
      scaleInfo = csvSpec.specified[3];
      chart.config.scaleInfo = csvSpec.specified[3];
      chart.config.sizeScale = csv.getScalingMethod(
        chart.config.sizeMethod,
        csv.extent([scaleInfo.position]),
        [chart.config.radius.min, chart.config.radius.max]);
      chart.config.series.symbolSize = function (d) {
        return chart.config.sizeScale(d[2]);
      };
    } else {
      chart.config.series.symbolSize = function (d) {
        return chart.config.radius.min;
      }
    }

    seriesNames = csv.uniqueArray(seriesInfo.position);
    if (chart.config.displayLegend) {
      options.legend = {data: seriesNames};
    }

    if (angleInfo.type == "string" || chart.config.angleAxisType == "category") {
      options.angleAxis = {
        type: "category",
        data: csv.uniqueArray(angleInfo.position)
      }
    }
    else {
      options.angleAxis = {type: "value"};
    }

    if (radiusInfo.type == "string" || chart.config.radiusAxisType == "category") {
      options.radiusAxis = {
        type: "category",
        data: csv.uniqueArray(radiusInfo.position)
      }
    }
    else {
      options.radiusAxis = {type: "value"};
    }

    seriesNames.forEach(function (seriesName) {
      var series = dex.config.expandAndOverlay(chart.config.series, {
        name: seriesName,
        coordinateSystem: 'polar',
        type: 'line',
        data: function (csv) {
          var selectedCsv = csv.selectRows(function (row) {
            return row[seriesInfo.position] == seriesName;
          });

          return selectedCsv.data.map(function (row, ri) {
            var newRow = [row[radiusInfo.position], row[angleInfo.position]];

            if (radiusInfo.type == "string" || chart.config.radiusAxisType == "category") {
              newRow[0] = options.radiusAxis.data.findIndex(function (val) {
                return val == row[radiusInfo.position];
              });
            }

            if (angleInfo.type == "string" || chart.config.angleAxisType == "category") {
              newRow[1] = options.angleAxis.data.findIndex(function (val) {
                return val == row[angleInfo.position];
              });
            }

            if (scaling) {
              newRow.push(row[chart.config.scaleInfo.position]);
            }
            row.forEach(function (col, ci) {
              newRow.push(selectedCsv.header[ci] + ":::" + col);
            });
            return newRow;
          });
        }(chart.config.csv)
      });
      options.series.push(series);
    });
    //dex.console.log("OPTIONS", JSON.stringify(options));
    //dex.console.log("OPTIONS", options);
    return options;
  };

  return chart;
};
module.exports = PolarPlot;