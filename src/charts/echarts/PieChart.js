/**
 *
 * Create an ECharts Pie Chart with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {PieChart} An ECharts Pie Chart configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var PieChart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_PieChart',
    'id': 'ECharts_PieChart',
    'class': 'ECharts_PieChart',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'pie',
    'palette': 'ECharts',
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
    'series.label.normal.position': 'inner',
    "options": {
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        'textStyle.color': '#000000',
        trigger: 'item',
        formatter: function (d) {
          var str = "<table class='dex-tooltip-table'>";
          str += "<th colspan='2'>" + d.seriesName + "</th>";
          Object.keys(d.data.csv).forEach(function (key) {
            str += "<tr><td>" + key + "</td><td>" + d.data.csv[key] + "</td></tr>"
          });
          str += "</table>";
          return str;
        }
      },
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);
  chart.spec = new dex.data.spec("Pie Chart")
    .any("series")
    .any("category")
    .number("value");

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
              "name": "Rose Chart",
              "description": "Render the pie in Nightinggale Rose style.",
              "target": "series.roseType",
              "type": "boolean",
              "initialValue": false
            },
            {
              "name": "Background Color",
              "description": "The color of the background.",
              "target": "options.backgroundColor",
              "type": "color",
              "initialValue": "#ffffff"
            },
            {
              "name": "Ring Padding",
              "description": "The padding between rings.",
              "target": "padding",
              "type": "int",
              "minValue": 1,
              "maxValue": 30,
              "initialValue": 10
            },
            {
              "name": "Max Percent",
              "description": "The maximum percent of canvas space the chart should take up.",
              "target": "maxPercent",
              "type": "int",
              "minValue": 40,
              "maxValue": 100,
              "initialValue": 80
            },
            {
              "name": "Aggregation Method",
              "description": "The aggregation method",
              "type": "choice",
              "choices": ["Sum", "Average", "Count", "Count Distinct"],
              "target": "aggregationMethod",
              "initialValue": "Sum"
            },
            {
              "name": "Show Zero Sum",
              "description": "Whether to show sector when all data are zero.",
              "target": "series.stillShowZeroSum",
              "type": "boolean",
              "initialValue": true
            },
            {
              "name": "Avoid Label Overlap",
              "description": "Whether to enable the strategy to avoid labels overlap.",
              "target": "series.avoidLabelOverlap",
              "type": "boolean",
              "initialValue": true
            }
          ]
        },
        dex.config.gui.echartsLabelGroup({}, "series.label"),
        {
          "type": "group",
          "name": "Label Lines",
          "contents": [
            dex.config.gui.echartsLineStyle({name: "Label Line: Normal"}, "series.labelLine.normal.lineStyle"),
            dex.config.gui.echartsLineStyle({name: "Label Line: Emphasis"}, "series.labelLine.emphasis.lineStyle"),
            {
              "name": "Show Label Lines",
              "description": "Whether to show label lines or not.",
              "target": "series.labelLine.normal.show",
              "type": "boolean",
              "initialValue": true
            },
            {
              "name": "Smooth",
              "description": "Whether to smooth label lines.",
              "target": "series.labelLine.normal.smooth",
              "type": "boolean",
              "initialValue": false
            }
          ]
        },
        dex.config.gui.echartsItemStyleGroup({}, "series.itemStyle")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var options, seriesNames, seriesInfo, valueInfo, categoryInfo;
    var csvSpec = chart.spec.parse(csv);

    options = dex.config.expandAndOverlay({
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: []
      },
      series: []
    }, chart.getCommonOptions());

    seriesInfo = csvSpec.specified[0];
    categoryInfo = csvSpec.specified[1];
    valueInfo = csvSpec.specified[2];

    chart.config.seriesInfo = seriesInfo;
    chart.config.categoryInfo = categoryInfo;
    chart.config.valueInfo = valueInfo;

    seriesNames = csv.uniqueArray(seriesInfo.position);
    categoryNames = csv.uniqueArray(categoryInfo.position);
    options.legend.data = categoryNames;

    var maxPercent = chart.config.maxPercent || 80.0;
    var maxPadding = chart.config.maxPadding || 10;

    var availableRadius = chart.config.radius ||
      Math.floor(maxPercent / (seriesNames.length + 2));

    var padding = chart.config.padding ||
      (Math.min((seriesNames.length <= 1) ? 0 :
        Math.floor(maxPercent / (2 * seriesNames.length - 2)), maxPadding));

    var startRadius = 0;
    var endRadius = Math.floor(availableRadius * 2);

    //dex.console.log("CONFIG-SERIES", chart.config.series);
    seriesNames.forEach(function (seriesName) {
      var seriesCsv = csv.selectRows(function (row) {
        return row[seriesInfo.position] == seriesName;
      });

      var series = dex.config.expandAndOverlay(chart.config.series, {
        type: 'pie',
        name: seriesName,
        radius: [startRadius + "%", endRadius + "%"],
        data: seriesCsv.data.map(function (row, ri) {
          var obj = {};
          row.forEach(function (col, ci) {
            obj[csv.header[ci]] = col;
          });
          var newRow = {
            name: row[categoryInfo.position],
            value: row[valueInfo.position],
            csv: obj
          };
          return newRow;
        })
      });

      options.series.push(series);
      startRadius = padding + endRadius;
      endRadius = startRadius + availableRadius;
    });

    //dex.console.log("OPTIONS", JSON.stringify(options));
    return options;
  };

  return chart;
};
module.exports = PieChart;