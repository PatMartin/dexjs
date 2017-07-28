/**
 *
 * Create an ECharts Radar Chart with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {RadarChart} An ECharts Network configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var RadarChart = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_RadarChart',
    'id': 'ECharts_RadarChart',
    'class': 'ECharts_RadarChart',
    'resizable': true,
    'refreshType': "update",
    'width': "100%",
    'height': "100%",
    'palette': 'ECharts',
    'type': 'radar',
    'series.itemStyle': {
      normal: {
        lineStyle: {
          width: 1,
          opacity: .8
        }
      },
      emphasis: {
        lineStyle: {width: 5, opacity: 1},
        areaStyle: "solid"
      }
    },
    "options": {
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        'textStyle.color': '#000000',
        formatter: function (d) {
          dex.console.log("D", d);
          var str = "<table class='dex-tooltip-table'>";
          str += "<th colspan='2'>" + d.name + "</th>";
          d.value.forEach(function (val, vi) {
            str += "<tr><td>" + (vi + 1) + "</td><td>" + d.value[vi] + "</td></tr>";
          });
          str += "</table>";
          return str;
        }
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);
  chart.spec = new dex.data.spec("Radar Chart")
    .string("series")
    .any("angle")
    .match("radius", "number|boolean");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Radar Chart Settings",
      "contents": [

        {
          "type": "group",
          "name": "General Options",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            dex.config.gui.echartsGrid({}, "options.grid"),
            dex.config.gui.echartsSymbol({}, "series"),
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
        dex.config.gui.echartsLabel({name: "Normal Label"}, "series.label.normal"),
        dex.config.gui.echartsLabel({name: "Emphasis Label"}, "series.label.emphasis")
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var options, seriesNames, seriesInfo, angleInfo, radiusInfo, maxRadius, minRadius;
    var csvSpec = chart.spec.parse(csv);

    options = dex.config.expandAndOverlay(chart.config.options, {
      series: [],
      legend: {},
      radar: {}
    }, chart.getCommonOptions());

    seriesInfo = csvSpec.specified[0];
    angleInfo = csvSpec.specified[1];
    radiusInfo = csvSpec.specified[2];

    chart.config.seriesInfo = seriesInfo;
    chart.config.angleInfo = angleInfo;
    chart.config.radiusInfo = radiusInfo;

    [minRadius, maxRadius] = csv.extent([radiusInfo.position]);

    options.radar.indicator = csv.uniqueArray(angleInfo.position)
      .reverse().map(function (value) {
        return {text: "" + value, max: maxRadius, min: minRadius};
      });

    options.legend.data = csv.uniqueArray(seriesInfo.position);

    var series = dex.config.expandAndOverlay(chart.config.series, {
      type: 'radar',
      name: "Series Name",
      data: options.legend.data.map(function (seriesName) {
        return {
          name: seriesName,
          value: csv.selectRows(function (row) {
            return row[seriesInfo.position] === seriesName;
          }).data.map(function (row) {
            return row[radiusInfo.position]
          })
        }
      })
    });

    options.series.push(series);

    dex.console.log("OPTIONS", JSON.stringify(options));
    return options;
  };

  return chart;
};
module.exports = RadarChart;