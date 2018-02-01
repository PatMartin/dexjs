/**
 *
 * Create an ECharts Network with the given specification.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {Network} An ECharts Network configured to specification.
 *
 * @memberof dex/charts/echarts
 *
 */
var Timeline = function (userConfig) {
  var chart;

  var defaults = {
    'parent': '#ECharts_TimelineParent',
    'id': 'ECharts_TimelineId',
    'class': 'ECharts_TimelineClass',
    'refreshType': "update",
    'resizable': true,
    'width': "100%",
    'height': "100%",
    'type': 'timeline',
    'palette': 'ECharts',
    'sizeScale': new dex.csv().getScalingMethods().linear,
    'radius': {min: 5, max: 50},
    'series.type': 'scatter',
    "options": {
      baseOption: {
        tooltip: {
          backgroundColor: "#FFFFFF",
          borderColor: "#000000",
          borderWidth: 2,
          trigger: 'item',
          formatter: function (d) {
            //dex.console.log("FORMATTER", d);
            var str = "<table class='dex-tooltip-table'>";
            Object.keys(d.data[5]).forEach(function (key) {
              str += "<tr><td><strong>" + key + "</strong></td><td>" + d.data[5][key] + "</td></tr>";
            });
            str += "</table>";
            return str;
          }
        }
      }
    }
  };

  var combinedConfig = dex.config.expandAndOverlay(userConfig, defaults);
  chart = dex.charts.echarts.EChart(combinedConfig);
  chart.spec = new dex.data.spec("Timeline")
    .string("series")
    .match("sequence", "number|date")
    .number("x")
    .number("y")
    .number("size");

  chart.getGuiDefinition = function getGuiDefinition(config) {
    var defaults = {
      "type": "group",
      "name": "EChart Timeline Settings",
      "contents": [
        {
          "type": "group",
          "name": "General Options",
          "contents": [
            dex.config.gui.echartsTimeline({}, "options.baseOption.timeline"),
            dex.config.gui.echartsTitle({}, "options.baseOption.title"),
            dex.config.gui.echartsGrid({}, "options.baseOption.grid"),
            dex.config.gui.echartsTooltip({}, "options.baseOption.tooltip"),
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
              "target": "options.baseOption.backgroundColor",
              "type": "color",
              "initialValue": "#ffffff"
            }
          ]
        },
        {
          "type": "group",
          "name": "Labels",
          "contents": [
            dex.config.gui.echartsLabel({name: "Normal"}, "series.label.normal"),
            dex.config.gui.echartsLabel({name: "Emphasis"}, "series.label.emphasis")
          ]
        },
        {
          "type": "group",
          "name": "Axis",
          "contents": [
            dex.config.gui.echartsAxis({name: "X Axis"}, "options.baseOption.xAxis"),
            dex.config.gui.echartsAxis({name: "Y Axis"}, "options.baseOption.yAxis")
          ]
        }
      ]
    };

    var guiDef = dex.config.expandAndOverlay(config, defaults);
    dex.config.gui.sync(chart, guiDef);
    return guiDef;
  };

  chart.getOptions = function (csv) {
    var csvSpec = chart.spec.parse(csv);

    var catMap = {};
    var seqMap = {};
    var options, category, sequence, seriesInfo, sequenceInfo, xInfo, yInfo, sizeInfo;

    seriesInfo = csvSpec.specified[0];
    sequenceInfo = csvSpec.specified[1];
    xInfo = csvSpec.specified[2];
    yInfo = csvSpec.specified[3];
    sizeInfo = csvSpec.specified[4];

    chart.config.seriesInfo = seriesInfo;
    chart.config.sequenceInfo = sequenceInfo;
    chart.config.xInfo = xInfo;
    chart.config.yInfo = yInfo;
    chart.config.sizeInfo = sizeInfo;

    var colors = dex.color.palette[chart.config.palette];

    options = dex.config.expandAndOverlay(chart.config.options, {
      "baseOption": {
        "timeline": {
          "axisType": "category",
          "orient": "vertical",
          "autoPlay": true,
          "inverse": true,
          "playInterval": 1000,
          "left": null,
          "right": 0,
          "top": 20,
          "bottom": 20,
          "width": 55,
          "height": null,
          "label": {
            "normal": {
              "textStyle": {
                "color": "#999"
              }
            },
            "emphasis": {
              "textStyle": {
                "color": "#fff"
              }
            }
          },
          "symbol": "none",
          "lineStyle": {
            "color": "#555"
          },
          "checkpointStyle": {
            "color": "#bbb",
            "borderColor": "#777",
            "borderWidth": 2
          },
          "controlStyle": {
            "showNextBtn": true,
            "showPrevBtn": true,
            "normal": {
              "color": "#666",
              "borderColor": "#666"
            },
            "emphasis": {
              "color": "#aaa",
              "borderColor": "#aaa"
            }
          },
          // REM: Sequence Names
          "data": []
        },
        "backgroundColor": "#404a59",
        "title": [
          {
            "text": 1800,
            "textAlign": "center",
            "left": "63%",
            "top": "55%",
            "textStyle": {
              "fontSize": 100,
              "color": "rgba(255, 255, 255, 0.7)"
            }
          }
        ],
        "tooltip": {
          "padding": 5,
          "backgroundColor": "#222",
          "borderColor": "#777",
          "borderWidth": 1
        },
        "grid": {
          "left": "12%",
          "right": "110"
        },
        "xAxis": {
          "type": "value",
          "name": xInfo.header,
          "max": "dataMax",
          "min": "dataMin",
          "nameGap": 25,
          "nameLocation": "middle",
          "nameTextStyle": {"fontSize": 18},
          "splitLine": {"show": false},
          "axisLine": {"lineStyle": {"color": "#ccc"}},
          "axisLabel": {"formatter": "{value}"}
        },
        "yAxis": {
          "type": "value",
          "name": yInfo.header,
          "max": "dataMax",
          "min": "dataMin",
          "nameTextStyle": {"color": "#ccc", "fontSize": 18},
          "axisLine": {"lineStyle": {"color": "#ccc"}},
          "splitLine": {"show": false},
          "axisLabel": {"formatter": "{value}"}
        },
        "visualMap": [{
          "show": false,
          "dimension": 3,
          "categories": [],
          "calculable": true,
          "precision": 0.1,
          "textGap": 30,
          "textStyle": {"color": "#ccc"},
          "inRange": {"color": colors}
        }]
      },
      options: []
    });

    var sizeExtents = csv.extent([sizeInfo.position]);

    chart.config.sizeScale.domain(sizeExtents)
      .range([chart.config.radius.min, chart.config.radius.max]);

    if (sequenceInfo.type == "date") {
      options.baseOption.timeline.axisType = "time";
    }

    if (xInfo.type == "number" || xInfo.type == "date") {
      [options.baseOption.xAxis.min, options.baseOption.xAxis.max] =
        csv.extent([xInfo.position]);
    }

    if (yInfo.type == "number" || yInfo.type == "date") {
      [options.baseOption.yAxis.min, options.baseOption.yAxis.max] =
        csv.extent([yInfo.position]);
    }



    sequences = csv.uniqueArray(sequenceInfo.position).sort();
    seriesNames = csv.uniqueArray(seriesInfo.position);
    options.baseOption.timeline.data = sequences;
    options.baseOption.visualMap[0].categories = seriesNames;
    xs = csv.uniqueArray(xInfo.position).sort();
    ys = csv.uniqueArray(xInfo.position).sort();

    sequences.forEach(function (sequence, seqNum) {
      var sequenceCsv = csv.selectRows(function (row) {
        return row[sequenceInfo.position] == sequence;
      });

      var series = dex.config.expandAndOverlay(chart.config.series, {
        type: "scatter",
        symbolSize: function (row) {
          return chart.config.sizeScale(row[2]);
        }
      });
      var frame = {};
      frame.title = {show: true, text: sequence};
      series.name = sequence;
      series.data = sequenceCsv.data.map(function (row, ri) {
        var newRow = [row[xInfo.position], row[yInfo.position], row[sizeInfo.position],
          row[seriesInfo.position], sequence];
        var obj = {};
        // Extra data for tooltips.
        row.forEach(function (col, ci) {
          obj[sequenceCsv.header[ci]] = col;
        });
        newRow.push(obj);
        return newRow;
      });
      frame.series = series;
      if (seqNum == 0) {
        options.baseOption.series = [series];
      }
      options.options.push(frame);
    });

    //dex.console.log(JSON.stringify(options));
    return options;
  };

  chart.clone = function clone(override) {
    return Timeline(dex.config.expandAndOverlay(override, userConfig));
  };

  return chart;
};
module.exports = Timeline;