/**
 *
 * Create an ECharts SteamGraph with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {SteamGraph} An ECharts Steam Graph configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var SteamGraph = function (userConfig) {
  var chart;

  defaults = {
    'parent': '#ECharts_SteamGraph',
    'id': 'ECharts_SteamGraph',
    'class': 'ECharts_SteamGraph',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'steam',
    "dimensions": { "series": 0, "x": 1, "y": 2 },
    "options": {
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        'textStyle.color': '#000000',
        trigger: 'axis',
        formatter: function (d) {
          var str = "<table class='dex-tooltip-table'>";
          str += "<th colspan='2'>" + d[0].axisValue + "</th>";
          d.forEach(function (row) {
            str += "<tr><td>" + row.data[2] + "</td><td>" + row.data[1] + "</td></tr>"
          });
          str += "</table>";
          return str;
        },
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: 'rgba(0,0,0,0.2)',
            width: 1,
            type: 'solid'
          }
        }
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);
  chart.spec = new dex.data.spec("Steam Graph")
    .any("series")
    .any("x")
    .number("y");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Steam Graph Settings",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            dex.config.gui.columnDimensions({},
              "dimensions",
              chart.config.csv,
              chart.config.dimensions),
            {
              "name": "Display Legend",
              "description": "Determines whether or not to draw the legend or not.",
              "type": "boolean",
              "target": "options.legend.show",
              "initialValue": true
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
              "name": "Background Color",
              "description": "The color of the background.",
              "target": "options.backgroundColor",
              "type": "color",
              "initialValue": "#ffffff"
            }
          ]
        },
        dex.config.gui.margins({}, "options.singleAxis"),
        dex.config.gui.echartsTitle({}, "options.title"),
        dex.config.gui.echartsGrid({}, "options.grid"),
        dex.config.gui.echartsTooltip({}, "options.tooltip"),
        dex.config.gui.echartsLabelGroup({}, "series.label"),
        dex.config.gui.echartsItemStyleGroup({}, "options.itemStyle"),
        dex.config.gui.echartsAxis({name: "X Axis"}, "options.singleAxis"),
        dex.config.gui.echartsDataZoom({name: "X Axis: Data Zoom"}, "options.dataZoom")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var options, seriesNames, seriesInfo, xInfo, valueInfo;
    var csvSpec = chart.spec.parse(csv, chart.config.dimensions);

    options = dex.config.expandAndOverlay(chart.config.options, {
      title: [],
      singleAxis: {
        scale: true,
        bottom: "10%",
        axisPointer: {
          animation: true,
          label: {
            show: true
          }
        },
      },
      series: [],
      legend: {},
      dataZoom: {
        show: true,
        realtime: true,
        start: 0,
        end: 100,
        singleAxisIndex: 0
      }
    }, chart.getCommonOptions());

    seriesInfo = csvSpec.specified[0];
    xInfo = csvSpec.specified[1];
    valueInfo = csvSpec.specified[2];

    chart.config.seriesInfo = seriesInfo;
    chart.config.xInfo = xInfo;
    chart.config.valueInfo = valueInfo;

    seriesNames = csv.uniqueArray(seriesInfo.position);
    options.legend.data = seriesNames;

    switch (xInfo.type) {
      case "string": {
        options.singleAxis.type = "category";
        options.singleAxis.data = csv.uniqueArray(xInfo.position);
        break;
      }
      case "date": {
        options.singleAxis.type = "time";
        break;
      }
      default: {
        options.singleAxis.type = "value";
      }
    }

    var dataColumns = [xInfo.position, valueInfo.position, seriesInfo.position];

    var series = dex.config.expandAndOverlay(chart.config.series, {
      type: 'themeRiver',
      itemStyle: {
        emphasis: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)'
        }
      },
      data: function (csv) {
        return csv.data.map(function (row, ri) {
          var newRow = [row[xInfo.position], row[valueInfo.position], row[seriesInfo.position]];
          if (xInfo.type === "string") {
            newRow[0] = options.singleAxis.data.findIndex(function (val) {
              return val == row[xInfo.position];
            });
          }
          return newRow;
        });
      }(csv)
    });

    options.series.push(series);

    //dex.console.log("OPTIONS", JSON.stringify(options));
    return options;
  };

  chart.clone = function clone(override) {
    return SteamGraph(dex.config.expandAndOverlay(override, userConfig));
  };

  return chart;
};
module.exports = SteamGraph;