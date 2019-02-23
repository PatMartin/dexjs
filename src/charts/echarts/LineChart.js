/**
 *
 * Create an ECharts LineChart with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {LineChart} An ECharts Line Chart configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var LineChart = function (userConfig) {
  var chart;
  var defaults = {
    "parent": "#ECharts_LineChart",
    "id": "ECharts_LineChart",
    "class": "ECharts_LineChart",
    "resizable": true,
    "width": "100%",
    "height": "100%",
    "type": "linechart",
    "palette": "ECharts",
    "dimensions": { "series": 0, "x": 1, "y": 2 },
    // If I make this csv change aware, I can change update model to "update".
    "refreshType": "update",
    "series.symbol": "circle",
    "series.symbolSize": 10,
    "series.type": "line",
    "series.showSymbol": true,
    "series.showAllSymbol": false,
    "series.stack": false,
    "series.clipOverflow": true,
    "series.connectNulls": false,
    "series.step": false,
    "options": {
      legend: {show: true},
      dataZoom: [
        {
          orient: "horizontal",
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          xAxisIndex: 0
        },
        {
          orient: "vertical",
          show: true,
          realtime: true,
          start: 0,
          end: 100,
          yAxisIndex: 0
        }
      ],
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        trigger: "item",
        position: function (pos, params, dom, rect, size) {
          return [pos[0] + 10, pos[1] - 0];
        },
        confine: true,
        formatter: function (d) {
          //dex.console.log("FORMATTER", d);
          var str = "<table class='dex-tooltip-table'>";

          d.data.forEach(function (value) {
            if (typeof value === "string") {
              var parts = value.split(":::");
              if (parts.length === 2) {
                str += "<tr><td>" + parts[0] + "</td><td>" + parts[1] + "</td></tr>";
              }
            }
          });
          str += "</table>";
          return str;
        }
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.spec = new dex.data.spec("Line Chart")
    .any("series")
    .any("x")
    .any("y");

  //dex.console.log("SPEC", chart.spec);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Line Chart Settings",
      "contents": [
        {
          "type": "group",
          "name": "General Options",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            dex.config.gui.echartsGrid({}, "options.grid"),
            dex.config.gui.echartsTooltip({}, "options.tooltip"),
            dex.config.gui.echartsSymbol({}, "series"),
            dex.config.gui.columnDimensions({},
              "dimensions",
              chart.config.csv,
              chart.config.dimensions),
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
              "name": "Series Type",
              "description": "The series type",
              "type": "choice",
              "target": "series.type",
              "choices": ["line", "scatter", "effectScatter", "bar"]
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
        dex.config.gui.echartsLabelGroup({}, "series.label"),
        {
          "type": "group",
          "name": "Axis",
          "contents": [
            dex.config.gui.echartsAxis({name: "X Axis"}, "options.xAxis"),
            dex.config.gui.echartsDataZoom({name: "X Axis Data Zoom"}, "xAxisDataZoom"),
            dex.config.gui.echartsAxis({name: "Y Axis"}, "options.yAxis"),
            dex.config.gui.echartsDataZoom({name: "Y Axis Data Zoom"}, "yAxisDataZoom"),
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var options, seriesNames, seriesInfo, xInfo, yInfo;

    //var csvSpec = chart.spec.parse(csv, chart.config.dimensions);
    var csvSpec = chart.spec.parse(csv);

    //dex.console.log("CHART-CONFIG", chart.config);
    //dex.console.log("LINE-CHART-CSV", csv);

    // Override precedence on options: chart, local defs, common defs.
    options = dex.config.expandAndOverlay(
      chart.config.options,
      {series: []},
      chart.getCommonOptions());

    //dex.console.log("LINE-CHART-OPTIONS", options);

    if (chart.config.xAxisDataZoom !== undefined) {
      options.dataZoom[0] = dex.config.expandAndOverlay(chart.config.xAxisDataZoom, options.dataZoom[0]);
    }

    if (chart.config.yAxisDataZoom !== undefined) {
      options.dataZoom[1] = dex.config.expandAndOverlay(chart.config.yAxisDataZoom, options.dataZoom[1]);
    }

    seriesInfo = csvSpec.specified[0];
    xInfo = csvSpec.specified[1];
    yInfo = csvSpec.specified[2];

    var seriesIndex = csvSpec.specified[0].position;
    var xIndex = csvSpec.specified[1].position;
    var yIndex = csvSpec.specified[2].position;
    var types = csv.guessTypes();

    var xType = types[xIndex];
    var yType = types[yIndex];
    var seriesType = types[seriesIndex];

    seriesNames = csv.uniqueArray(seriesIndex);
    options.legend = {data: seriesNames};

    if (xType == "string") {
      options.xAxis = dex.config.expandAndOverlay({
        type: "category",
        data: csv.uniqueArray(xIndex)
      }, options.xAxis);
    }
    else if (xType == "date") {
      options.xAxis = dex.config.expandAndOverlay({
        type: "time"
      }, options.xAxis);
      options.xAxis.data = undefined;
    }
    else {
      options.xAxis = dex.config.expandAndOverlay({
        type: "value"
      }, options.xAxis);
      options.xAxis.data = undefined;
    }

    if (yType == "string") {
      options.yAxis = dex.config.expandAndOverlay({
        type: "category",
        data: csv.uniqueArray(yIndex)
      }, options.yAxis);
    }
    else if (yType == "date") {
      options.yAxis = dex.config.expandAndOverlay({
        type: "time"
      }, options.yAxis);
      options.yAxis.data = undefined;
    }
    else {
      options.yAxis = dex.config.expandAndOverlay({
        type: "value"
      }, options.yAxis);
      options.yAxis.data = undefined;
    }

    // Set formatters here.
    if (options.xAxis.axisLabel !== undefined && options.xAxis.axisLabel.formatter !== undefined) {
      options.xAxis.axisLabel.formatter =
        dex.config.getFormatter(options.xAxis.axisLabel.formatter, xType);
    }

    if (options.yAxis.axisLabel !== undefined && options.yAxis.axisLabel.formatter !== undefined) {
      options.yAxis.axisLabel.formatter =
        dex.config.getFormatter(options.yAxis.axisLabel.formatter, yType);
    }

    seriesNames.forEach(function (seriesName) {
      var selectedCsv = csv.selectRows(function (row) {
        return row[seriesIndex] == seriesName;
      });

      var seriesData = selectedCsv.data.map(function (row, ri) {
        var newRow = [row[xIndex], row[yIndex]];
        row.forEach(function (col, ci) {
          newRow.push(selectedCsv.header[ci] + ":::" + col);
        });
        return newRow;
      });

      var series = dex.config.expandAndOverlay(chart.config.series, {
        name: seriesName,
        type: "line",
        data: seriesData
      });
      options.series.push(series);
      seriesData = undefined;
    });
    //dex.console.log("OPTIONS", JSON.stringify(options));
    return options;
  };

  return chart;
};
module.exports = LineChart;