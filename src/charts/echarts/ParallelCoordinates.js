/**
 *
 * Create an ECharts LineChart with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {ParallelCoordinates} An ECharts Parallel Coordinates chart configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var ParallelCoordinates = function (userConfig) {
  var chart;
  var defaults = {
    "parent": "#ECharts_ParallelCoordinates",
    "id": "ECharts_ParallelCoordinates",
    "class": "ECharts_ParallelCoordinates",
    "resizable": true,
    "width": "100%",
    "height": "100%",
    "type": "linechart",
    "palette": "ECharts",
    "refreshType": "update",
    "series": {},
    "options": {}
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.spec = new dex.data.spec("Parallel Coordinates").anything();

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Parallel Coordinates Settings",
      "contents": [
        {
          "type": "group",
          "name": "General Options",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            dex.config.gui.echartsGrid({}, "options.grid"),
            dex.config.gui.echartsTooltip({}, "options.tooltip"),
            {
              "name": "Color Scheme",
              "description": "The color scheme.",
              "target": "palette",
              "type": "choice",
              "choices": dex.color.colormaps({shortlist: true}),
              "initialValue": "category10"
            },
            {
              "name": "Top Margin",
              "description": "The top margin of the chart.",
              "target": "options.parallel.top",
              "type": "int",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 60
            },
            {
              "name": "Bottom Margin",
              "description": "The bottom margin of the chart.",
              "target": "options.parallel.bottom",
              "type": "int",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 60
            },
            {
              "name": "Left Margin",
              "description": "The left margin of the chart.",
              "target": "options.parallel.left",
              "type": "int",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 80
            },
            {
              "name": "Right Margin",
              "description": "The right margin of the chart.",
              "target": "options.parallel.right",
              "type": "int",
              "minValue": 0,
              "maxValue": 200,
              "initialValue": 80
            },
            {
              "name": "Display Legend",
              "description": "Determines whether or not to draw the legend or not.",
              "type": "boolean",
              "target": "options.legend.show",
              "initialValue": true
            },
            {
              "name": "Background Color",
              "description": "The color of the background.",
              "target": "options.backgroundColor",
              "type": "color",
              "initialValue": "#000000"
            },
            {
              "name": "Active Opacity",
              "description": "Opacity of active lines.",
              "target": "series.activeOpacity",
              "type": "float",
              "minValue": 0,
              "maxValue": 1,
              "initialValue": 1
            },
            {
              "name": "Inactive Opacity",
              "description": "Opacity of inactive lines.",
              "target": "series.inactiveOpacity",
              "type": "float",
              "minValue": 0,
              "maxValue": 1,
              "initialValue": .05
            }
          ]
        },
        dex.config.gui.echartsLineStyle({name: "Line Style: Normal"}, "series.lineStyle"),
        dex.config.gui.echartsLineStyle({name: "Line Style: Emphasis"}, "series.lineStyle.emphasis")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var options, seriesNames, seriesInfo, xInfo, yInfo;

    var csvSpec = chart.spec.parse(csv);

    // Override precedence on options: chart, local defs, common defs.
    options = dex.config.expandAndOverlay(
      chart.config.options,
      {
        parallelAxis: [],
        series: []
      },
      chart.getCommonOptions());

    csvSpec.types.forEach(function (type, ti) {
      if (type === "string") {
        options.parallelAxis.push({
          dim: ti,
          name: csv.header[ti],
          type: "category",
          data: csv.uniqueArray(ti).sort()
        });
      }
      else if (type === "number") {
        options.parallelAxis.push({
          dim: ti,
          name: csv.header[ti]
        });
      }
      else if (type === "date") {
      }
      else {
      }
    });

    if (csvSpec.types[0] === "string") {
      var seriesInfo = csvSpec.specified[0];
      seriesNames = csv.uniqueArray(seriesInfo.position);
      options.legend = {data: seriesNames};

      seriesNames.forEach(function (seriesName) {
        var selectedCsv = csv.selectRows(function (row) {
          return row[seriesInfo.position] == seriesName;
        });

        var series = dex.config.expandAndOverlay(chart.config.series, {
          name: seriesName,
          type: "parallel",
          data: selectedCsv.data
        });
        options.series.push(series);
        seriesData = undefined;
      });
    }
    else {
      options.series.push(
        dex.config.expandAndOverlay(chart.config.series,
          {type: "parallel", data: csv.data}));
    }

    //dex.console.log("OPTIONS", JSON.stringify(options.series));
    //dex.console.log("CONFIG-OPTIONS: ", JSON.stringify(chart.config.options));
    return options;
  };

  return chart;
};
module.exports = ParallelCoordinates;