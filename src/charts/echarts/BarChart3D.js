/**
 *
 * Create an ECharts LineChart with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {BarChart3D} An ECharts 3D Bar Chart configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var BarChart3D = function (userConfig) {
  var chart;
  var defaults = {
    'parent': '#ECharts_LineChart',
    'id': 'ECharts_LineChart',
    'class': 'ECharts_LineChart',
    'colorScheme': 'YlGnBu_3',
    'series.type': 'bar3D',
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'palette': "ECharts",
    'refreshType': "render",
    radius: { min: 5, max: 25 },
    "options": {
      grid3D: {
        boxWidth: 200,
        boxDepth: 80,
        viewControl: {
          // projection: 'orthographic'
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true
          },
          ambient: {
            intensity: 0.3
          }
        }
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.spec = new dex.data.spec("3D Bar Chart")
    .any("x")
    .any("y")
    .oneOrMoreMatch("z", "number");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart 3D Bar Chart Settings",
      "contents": [
        {
          "type": "group",
          "name": "General Options",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            dex.config.gui.echartsGrid({}, "options.grid3D"),
            dex.config.gui.echartsTooltip({}, "options.tooltip"),
            {
              "name": "Color Scheme",
              "description": "The color scheme.",
              "target": "colorScheme",
              "type": "choice",
              "choices": dex.color.colormaps(),
              "initialValue": "ECharts"
            },
            {
              "name": "Chart Type",
              "description": "The type of chart.",
              "target": "series.type",
              "type": "choice",
              "choices": ['bar3D', 'line3D', 'lines3D', 'scatter3D'],
              "initialValue": "bar3D"
            },
            {
              "name": "Shading",
              "description": "The shading.",
              "target": "series.shading",
              "type": "choice",
              "choices": ["color", "lambert", "realistic"],
              "initialValue": "color"
            },
            {
              "name": "Background Color",
              "description": "The color of the background.",
              "target": "options.backgroundColor",
              "type": "color",
              "initialValue": "#000000"
            },
            {
              "name": "Symbol Size Minimum",
              "description": "The minimum size of the symbols",
              "type": "int",
              "target": "radius.min",
              "minValue": 0,
              "maxValue": 50,
              "initialValue": 5
            },
            {
              "name": "Symbol Size Maximum",
              "description": "The maximum size of the symbols",
              "type": "int",
              "target": "radius.max",
              "minValue": 0,
              "maxValue": 50,
              "initialValue": 20
            }
          ]
        },
        {
          "type": "group",
          "name": "Item Style",
          "contents": [
            dex.config.gui.echartsItemStyle({name: "Item Style: Normal"}, "series.itemStyle"),
            dex.config.gui.echartsItemStyle({name: "Item Style: Emphasis"}, "series.emphasis.itemStyle"),
          ]
        },
        {
          "type": "group",
          "name": "Label Style",
          "contents": [
            dex.config.gui.echartsLabel({name: "Label: Normal"}, "series.label"),
            dex.config.gui.echartsLabel({name: "Label: Emphasis"}, "series.emphasis.label"),
          ]
        },
        {
          "type": "group",
          "name": "Axis",
          "contents": [
            dex.config.gui.echartsAxis({name: "X Axis"}, "options.xAxis3D"),
            dex.config.gui.echartsAxis({name: "Y Axis"}, "options.yAxis3D"),
            dex.config.gui.echartsAxis({name: "Z Axis"}, "options.zAxis3D")
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var options, seriesNames, seriesInfo, xInfo, yInfo, zInfo;
    var csvSpec = chart.spec.parse(csv);

    // Override precedence on options: chart, local defs, common defs.
    options = dex.config.expandAndOverlay(
      chart.config.options,
      {
        grid3D: {
          boxWidth: 200,
          boxDepth: 80,
          light: {
            main: {
              intensity: 1.2
            },
            ambient: {
              intensity: 0.3
            }
          }
        },
        visualMap: {
          max: 200,
          calculable: true,
          inRange: {
            color: dex.color.palette[chart.config.colorScheme]
          }
        },
        series: []
      },
      chart.getCommonOptions());

    xInfo = csvSpec.specified[0];
    yInfo = csvSpec.specified[1];
    zInfos = [];
    zColumns = [];
    for (i = 2; i < csvSpec.specified.length; i++) {
      zInfos.push(csvSpec.specified[i]);
      zColumns.push(csvSpec.specified[i].position);
    }

    chart.config.xInfo = xInfo;
    chart.config.yInfo = yInfo;
    chart.config.zInfos = zInfos;

    if (xInfo.type == "string") {
      options.xAxis3D = dex.config.expandAndOverlay({
        type: "category",
        data: csv.uniqueArray(xInfo.position)
      }, options.xAxis3D);
    }
    else {
      options.xAxis3D = dex.config.expandAndOverlay({
        type: "value"
      }, options.xAxis3D);
      options.xAxis3D.data = undefined;
    }

    if (yInfo.type == "string") {
      options.yAxis3D = dex.config.expandAndOverlay({
        type: "category",
        data: csv.uniqueArray(yInfo.position)
      }, options.yAxis3D);
    }
    else {
      options.yAxis3D = dex.config.expandAndOverlay({
        type: "value"
      }, options.yAxis3D);
      options.yAxis3D.data = undefined;
    }

    // Z must be numeric
    options.zAxis3D = dex.config.expandAndOverlay({
      type: "value"
    }, options.zAxis3D);
    options.zAxis3D.data = undefined;
    options.visualMap.max = csv.extent(zColumns)[1];

    // Use the last dimension in a scatter3D as a size parameter.
    var sizeInfo = undefined;
    var sizeScale = undefined;
    if (chart.config.series.type == "scatter3D" && zInfos.length > 1) {
      sizeInfo = zInfos.pop();
      sizeScale = d3.scale.linear()
        .domain(csv.extent([sizeInfo.position]))
        .range([chart.config.radius.min, chart.config.radius.max]);
    }


    zInfos.forEach(function (zInfo, i) {
      var series = dex.config.expandAndOverlay(chart.config.series, {
        shading: 'color',
        stack: 'stack',
        itemStyle: {
          opacity: 0.7
        },
        emphasis: {
          label: {
            textStyle: {
              fontSize: 20,
              color: '#900'
            }
          },
          itemStyle: {
            opacity: 1
          }
        },
        symbolSize: function (d, obj) {
          if (chart.config.series.type == "scatter3D" && sizeInfo !== undefined) {
            return sizeScale(csv.data[obj.dataIndex][sizeInfo.position]);
          }
          else {
            return chart.config.radius.min;
          }
        },
        data: function (csv) {

          return csv.data.map(function (row, ri) {
            var newRow = [];

            if (xInfo.type == "string") {
              newRow.push(options.xAxis3D.data.findIndex(function (val) {
                return val == row[xInfo.position];
              }));
            }
            else {
              newRow.push(row[xInfo.position]);
            }

            if (yInfo.type == "string") {
              newRow.push(options.yAxis3D.data.findIndex(function (val) {
                return val == row[yInfo.position];
              }));
            }
            else {
              newRow.push(row[yInfo.position]);
            }

            if (zInfo.type == "string") {
              newRow.push(options.zAxis3D.data.findIndex(function (val) {
                return val == row[zInfo.position];
              }));
            }
            else {
              newRow.push(row[zInfo.position]);
            }
            return newRow;
          });
        }(chart.config.csv)
      });
      options.series.push(series);
    });

    //dex.console.log("ECHART-OPTIONS", JSON.stringify(options));
    return options;
  };

  chart.clone = function clone(override) {
    return BarChart3D(dex.config.expandAndOverlay(override, userConfig));
  };

  return chart;
};
module.exports = BarChart3D;