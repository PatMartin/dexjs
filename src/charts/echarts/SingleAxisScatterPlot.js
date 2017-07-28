/**
 *
 * Create an ECharts Single Axis ScatterPlot with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {SingleAxisScatterPlot} An ECharts Network configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var SingleAxisScatterPlot = function (userConfig) {
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
    'radius': {'min': 1, 'max': 20},
    'sizeMethod': 'linear',
    'sizeScale': function (value) {
      if (typeof sizeScale == "undefined") {
        sizeScale = chart.config.csv.getScalingMethod(
          chart.config.sizeMethod,
          chart.config.csv.extent([chart.config.valueInfo.position]),
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
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        formatter: function (d) {
          return "<table class='dex-tooltip-table'><tr><td><b>" + csv.header[1] + ":</b></td><td>" +
            d.data[0] + "</td></tr><tr><td><b>" + csv.header[2] +
            ":</b></td><td>" + d.data[1] + "</td></tr></table>";
        }
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);
  chart.spec = new dex.data.spec("Single Axis ScatterPlot")
    .any("series")
    .any("x")
    .number("size");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "Single Axis ScatterPlot Settings",
      "contents": [
        {
          "type": "group",
          "name": "General",
          "contents": [
            dex.config.gui.echartsTitle({}, "options.title"),
            dex.config.gui.echartsGrid({}, "options.grid"),
            dex.config.gui.echartsTooltip({}, "options.tooltip"),
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
            },
            {
              "name": "Size Scaling Method",
              "description": "The type of scaling method",
              "type": "choice",
              "target": "sizeMethod",
              "choices": ["linear", "pow", "log", "sqrt", "time"],
              "initialValue": "linear"
            },
            {
              "name": "Series Type",
              "description": "The series type",
              "type": "choice",
              "target": "series.type",
              "choices": ["scatter", "effectScatter"]
            }
          ]
        },
        dex.config.gui.echartsItemStyleGroup({}, "series.itemStyle"),
        dex.config.gui.echartsLabelGroup({}, "series.label"),
        {
          "type": "group",
          "name": "Axis",
          "contents": [
            dex.config.gui.echartsAxis({name: "X Axis"}, "singleAxis"),
            dex.config.gui.echartsDataZoom({name: "Data Zoom"}, "dataZoom")
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var options, seriesNames, seriesInfo, xInfo;
    var csvSpec = chart.spec.parse(csv);

    options = dex.config.expandAndOverlay(chart.config.options, {
      title: [],
      singleAxis: [],
      series: [],
      dataZoom: [
        {
          handleSize: '100%',
          filterMode: 'empty',
        }
      ],
    }, chart.getCommonOptions());

    seriesInfo = csvSpec.specified[0];
    xInfo = csvSpec.specified[1];
    valueInfo = csvSpec.specified[2];

    chart.config.seriesInfo = seriesInfo;
    chart.config.xInfo = xInfo;
    chart.config.valueInfo = valueInfo;

    seriesNames = csv.uniqueArray(seriesInfo.position);
    options.dataZoom[0].singleAxisIndex = dex.range(0, seriesNames.length);

    if (chart.config.dataZoom !== undefined) {
      options.dataZoom[0] = dex.config.expandAndOverlay(chart.config.dataZoom, options.dataZoom[0]);
    }

    var scatterHeightPercent = 90;
    var percentIncrement = scatterHeightPercent / seriesNames.length;
    var topOffset = 0;
    var heightOffset = 0;

    seriesNames.forEach(function (seriesName, si) {

      var seriesCsv = csv.selectRows(function (row) {
        return row[seriesInfo.position] == seriesName;
      });

      options.title.push({
        textBaseline: 'middle',
        top: "" + ((si + .5) * scatterHeightPercent / seriesNames.length) + "%",
        text: seriesName
      });

      var singleAxis = dex.config.expandAndOverlay(chart.config.singleAxis, {
        left: 150,
        type: 'category',
        data: seriesCsv.include([xInfo.position]).data,
        top: (si * percentIncrement + topOffset) + '%',
        height: (percentIncrement + heightOffset) + '%',
        axisLabel: {interval: 2}
      });

      if (xInfo.type == "string") {
        singleAxis.type = "category";
      }
      else {
        singleAxis.type = "value";
      }

      options.singleAxis.push(singleAxis);

      var series = dex.config.expandAndOverlay(chart.config.series, {
        singleAxisIndex: si,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: function (csv) {
          //dex.console.log("CSV", csv);
          return csv.data.map(function (row, ri) {
            var newRow;
            if (xInfo.type == "string") {
              newRow = [
                singleAxis.data.findIndex(function (val) {
                  return val == row[xInfo.position];
                }), row[valueInfo.position]];
            }
            else {
              newRow = [row[xInfo.position], row[valueInfo.position]];
            }
            return newRow;
          });
        }(seriesCsv),
        symbolSize: function (dataItem) {
          return chart.config.sizeScale(dataItem[1]);
        }
      });
      options.series.push(series);
    });
    //dex.console.log("OPTIONS", JSON.stringify(options));
    return options;
  };

  return chart;
};
module.exports = SingleAxisScatterPlot;