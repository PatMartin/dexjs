/**
 *
 * Create an ECharts HeatMap with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {HeatMap} An ECharts Line Chart configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var HeatMap = function (userConfig) {
  var chart;
  var defaults = {
    "parent": "#ECharts_HeatMap",
    "id": "ECharts_HeatMap",
    "class": "ECharts_HeatMap",
    "resizable": true,
    "width": "100%",
    "height": "100%",
    "type": "linechart",
    "palette": "HeatMap 1",
    "dimensions": {"series": 0, "x": 1, "y": 2},
    // If I make this csv change aware, I can change update model to "update".
    "refreshType": "update",
    "series.minOpacity": 0,
    "series.maxOpacity": 1,
    "series.name": "series",
    "series.type": "heatmap",
    "series.itemStyle": {
      emphasis: {
        borderColor: '#333',
        borderWidth: 1
      }
    },
    "options": {
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#000000",
        borderWidth: 2,
        trigger: "item",
        position: function (pos, params, dom, rect, size) {
          return [pos[0] + 10, pos[1] - 0];
        },
        confine: true
      },
      legend: {show: false},
      visualMap: {
        min: 1,
        max: 100,
        calculable: true,
        realtime: false,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);

  chart.spec = new dex.data.spec("Heatmap")
    .any("x")
    .any("y")
    .number("magnitude");

  //dex.console.log("SPEC", chart.spec);

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart HeatMap Settings",
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
              "initialValue": "HeatMap 1"
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
    var options, seriesInfo, xInfo, yInfo, vInfo;

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

    xInfo = csvSpec.specified[0];
    yInfo = csvSpec.specified[1];
    vInfo = csvSpec.specified[2];

    var xIndex = csvSpec.specified[0].position;
    var yIndex = csvSpec.specified[1].position;
    var vIndex = csvSpec.specified[2].position;
    var types = csv.guessTypes();

    var xType = types[xIndex];
    var yType = types[yIndex];
    var vType = types[vIndex];

    var extent = csv.extent(vIndex);

    var xData = csv.uniqueArray(xIndex);
    var yData = csv.uniqueArray(yIndex);

    options.visualMap.inRange.color = dex.color.palette[chart.config.palette];

    options.xAxis = dex.config.expandAndOverlay({
      type: "category",
      data: xData,
      splitArea: {
        show: true
      }
    }, options.xAxis);

    options.visualMap.min = extent[0];
    options.visualMap.max = extent[1];

    options.yAxis = dex.config.expandAndOverlay({
      type: "category",
      data: yData
    }, options.yAxis);

    // Set formatters here.
    if (options.xAxis.axisLabel !== undefined && options.xAxis.axisLabel.formatter !== undefined) {
      options.xAxis.axisLabel.formatter =
        dex.config.getFormatter(options.xAxis.axisLabel.formatter, xType);
    }

    if (options.yAxis.axisLabel !== undefined && options.yAxis.axisLabel.formatter !== undefined) {
      options.yAxis.axisLabel.formatter =
        dex.config.getFormatter(options.yAxis.axisLabel.formatter, yType);
    }

    options.tooltip.formatter =  function (d) {
      //dex.console.log("FORMATTER", d);
      var str = "<table class='dex-tooltip-table'>";

      csv.data[d.data[2]].forEach(function(col, ci) {
        str += "<tr><td>" + csv.header[ci] + "</td><td>" + col + "</td></tr>";
      });

      str += "</table>";
      return str;
    };

    var series = dex.config.expandAndOverlay(chart.config.series, {
      name: chart.config.series.name,
      type: "heatmap",
      data: csv.data.map(function(row, ri) {
        //dex.console.log("ROW", row, xData);
        var hdata = [
          xData.indexOf("" + row[0]),
          yData.indexOf("" + row[1]), ri, row[2]];
        return hdata;
      })
    });
    options.series = series;

    //dex.console.log("OPTIONS", JSON.stringify(options));
    return options;
  };

  return chart;
};
module.exports = HeatMap;