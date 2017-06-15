var echart = function (userConfig) {
    var chart;
    var internalChart = undefined;
    var effectiveOptions;

    var defaults = {
      'parent': '#EChartParent',
      'id': 'EChartId',
      'class': 'EChartClass',
      'resizable': true,
      'csv': {
        'header': [],
        'data': []
      },
      'series': {type: 'line'},
      'width': "100%",
      'height': "100%",
    };

    chart = new dex.component(userConfig, defaults);

    chart.render = function render() {
      var config = chart.config;
      var csv = config.csv;

      echarts.dispose(d3.select(config.parent)[0][0]);
      d3.select(config.parent).selectAll("*").remove();

      dex.console.log("PARENT: '" + config.parent + "'");
      //if (internalChart !== undefined) {
      //  internalChart.dispose();
      //}
      internalChart = echarts.init(
        d3.select(config.parent)[0][0]);

      // Calls update automatically.
      chart.resize();

      return chart;
    };

    chart.update = function () {
      var config = chart.config;
      var csv = config.csv;

      if (config.categorizationMethod) {
        config.categories = dex.csv.getCategorizationMethod(csv,
          config.categorizationMethod);
      }

      var dataOptions = getOptions(csv);
      effectiveOptions = dex.config.expandAndOverlay(config.options, dataOptions);
      internalChart.setOption(effectiveOptions);
      internalChart.resize();
    };

    function getOptions(csv) {
      var chartType = dex.object.getValue(chart.config, "type", "line");
      switch (chartType) {
        case "force" :
        case "circular" :
        case "graph" :
          return getGraphOptions(csv);
        case "timeline":
          return getTimelineOptions(csv);
        case "polar":
          return getPolarOptions(csv);
        case "linechart":
        case "areachart":
        case "bar":
          return getCartesianOptions(csv);
        case "pie":
          return getPieOptions(csv);
        case 'single-axis':
          return getSingleAxisOptions(csv);
        default:
          return getCartesianOptions(csv);
      }
    }

    function getPieOptions(csv) {
      var config = chart.config;
      var options = {
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
      };
      var gtypes = dex.csv.guessTypes(csv);

      // Get our indices:
      var seriesIndex = dex.csv.getColumnNumber(csv, config.seriesIndex);
      var nameIndex = dex.csv.getColumnNumber(csv, config.nameIndex);
      var valueIndex = dex.csv.getColumnNumber(csv, config.valueIndex);
      var aggregationFunction = chart.config.aggregationFunction;

      var pieCsv = dex.csv.columnSlice(csv, [seriesIndex, nameIndex, valueIndex]);

      var frames = dex.csv.getFramesByIndex(csv, seriesIndex);

      //dex.console.log("FRAMES", frames);
      var legendNames = {};

      var maxPercent = chart.config.maxPercent || 80.0;
      var maxPadding = chart.config.maxPadding || 10;
      var availableRadius = chart.config.radius ||
        Math.floor(maxPercent / (frames.frames.length + 2));
      var padding = chart.config.padding ||
        (Math.min((frames.frames.length <= 1) ? 0 :
          Math.floor(maxPercent / (2 * frames.frames.length - 2)), maxPadding));

      var startRadius = 0;
      var endRadius = Math.floor(availableRadius * 2);

      frames.frames.forEach(function (frame, fi) {
        var nvp = {};
        frame.data.forEach(function (row, ri) {
            if (nvp[row[0]] === undefined) {
              nvp[row[0]] = [];
            }
            nvp[row[0]].push(row[1]);
          }
        );
        var data = [];
        for (var name in nvp) {
          legendNames[name] = 1;
          data.push({"name": name, "value": aggregationFunction(nvp[name])});
        }
        var series = dex.config.expandAndOverlay(chart.config.series,
          {
            name: frames.frameIndices[fi],
            radius: [startRadius + "%", endRadius + "%"],
            data: data
          });
        options.series.push(series);
        startRadius = padding + endRadius;
        endRadius = startRadius + availableRadius;
      });

      options.legend.data = Object.keys(legendNames);

      dex.console.log("OPTIONS", options);
      return options;
    }

    function getPolarOptions(csv) {
      var config = chart.config;
      var options = {
        legend: {data: []},
        series: [],
        polar: {}
      };
      var gtypes = dex.csv.guessTypes(csv);

      // Get our indices:
      var angleIndex = dex.csv.getColumnNumber(csv, config.angleIndex);
      var valueIndex = dex.csv.getColumnNumber(csv, config.valueIndex);
      var seriesIndex = dex.csv.getColumnNumber(csv, config.seriesIndex);
      var radiusIndex = dex.csv.getColumnNumber(csv, config.radiusIndex);

      // Will contain required data indices for series.
      var columns = [];

      // We always need values.
      columns.push(valueIndex);
      //dex.console.log("ANGLE INDEX: ", config.angleIndex, angleIndex);

      switch (config.series.type) {
        case "line":
        case "scatter":
        case "bar" : {
          if (angleIndex === undefined) {
            options.angleAxis = {
              type: 'value',
              startAngle: 0
            };
          }
          else {
            if (gtypes[angleIndex] == "string" ||
              chart.config.angleAxisType == "category") {
              options.angleAxis = {
                type: "category",
                data: dex.csv.uniqueArray(csv, angleIndex)
              }
            }
            else {
              var extents = dex.csv.extent(csv, angleIndex);
              //dex.console.log("EXTENT", extents);
              options.angleAxis = {
                type: "value",
                min: "dataMin",
                max: "dataMax",
                boundaryGap: true
              };
              columns.push(angleIndex);
            }
          }

          if (radiusIndex === undefined) {
            options.radiusAxis = {};
          }
          else {
            if (gtypes[radiusIndex] == "string" ||
              chart.config.radiusAxisType == "category") {
              options.radiusAxis = {
                type: "category",
                data: dex.csv.uniqueArray(csv, radiusIndex)
              };
            }
            else {
              options.radiusAxis = {};
            }
          }

          break;
        }
      }

      if (options.radiusAxis.type == "category" &&
        options.angleAxis.type == "category") {
        columns = [ radiusIndex, angleIndex, valueIndex ];
      }
      var seriesNames = [];

      //dex.console.log("COLUMNS", columns);

      if (seriesIndex !== undefined) {
        seriesNames = dex.csv.uniqueArray(csv, seriesIndex);
        //dex.console.log("SERIES-NAMES", seriesNames);
        options.legend.data = seriesNames;

        seriesNames.forEach(function (seriesName) {
            var series = dex.config.expandAndOverlay(config.series,
              {
                name: seriesName,
                coordinateSystem: 'polar',
                type: 'line',
                data: function (csv) {
                  var selectedCsv = dex.csv.selectRows(csv, function (row) {
                    return row[seriesIndex] == seriesName;
                  });

                  if (columns.length == 1) {
                    return selectedCsv.data.map(function (row) {
                      return row[columns[0]];
                    });
                  }
                  else {
                    return dex.csv.columnSlice(selectedCsv, columns).data;
                  }
                }(chart.config.csv)
              });
            options.series.push(series);
          }
        );
      }
      else {
        var series = dex.config.expandAndOverlay(config.series,
          {
            name: 'Series',
            coordinateSystem: 'polar',
            type: 'line',
            data: csv.data.map(function (row) {
              return row[0];
            })
          });
        options.series.push(series);
      }

      dex.console.log("OPTIONS", options);
      return options;
    }

    function getCartesianOptions(csv) {
      var options = {};
      //var gtypes = dex.csv.guessTypes(csv);

      var xyCsv = dex.csv.removeColumn(csv, 0);
      options.legend = {data: xyCsv.remaining.header};

      options.xAxis = {
        type: 'category',
        boundaryGap: false,
        data: xyCsv.removed.data.map(function (row) {
          return row[0]
        })
      };
      options.yAxis = {type: 'value'};
      options.series = [];

      xyCsv.remaining.header.forEach(function (h) {
        var series = dex.config.expandAndOverlay(chart.config.series,
          {name: h, type: 'line', data: []});
        options.series.push(series);
      });

      xyCsv.remaining.data.forEach(function (row, ri) {
        row.forEach(function (col, ci) {
          options.series[ci].data.push(col);
        });
      });

      //dex.console.log("OPTIONS", options);
      return options;
    }

    function getSingleAxisOptions(csv) {
      var options = {
        tooltip: {
          position: 'top'
        },
        title: [],
        singleAxis: [],
        series: []
      };

      var frames = dex.csv.getFramesByIndex(csv, 0);

      var scatterHeightPercent = 90;
      var percentIncrement = scatterHeightPercent / frames.frameIndices.length;
      var topOffset = 0;
      var heightOffset = 0;

      frames.frames.forEach(function (frame, fi) {

        options.title.push({
          textBaseline: 'middle',
          top: "" + ((fi + .5) * scatterHeightPercent / frames.frameIndices.length) + "%",
          text: frames.frameIndices[fi]
        });

        options.singleAxis.push({
          left: 150,
          type: 'category',
          boundaryGap: true,
          data: dex.matrix.slice(frame.data, [0]),
          top: (fi * percentIncrement + topOffset) + '%',
          height: (percentIncrement + heightOffset) + '%',
          axisLabel: {interval: 2}
        });

        var series = dex.config.expandAndOverlay(chart.config.series, {
          singleAxisIndex: fi,
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: dex.matrix.slice(frame.data, [0, 1]),
          symbolSize: function (dataItem) {
            return chart.config.sizeScale(dataItem[1]);
          }
        });
        options.series.push(series);
      });

      //dex.console.log("OPTIONS", options);
      return options;
    }

    function getGraphOptions(csv) {
      var options = {};

      var nodes = {};
      var nodeId = 0;

      // Dynamically determine our categorization function:
      var categorize = dex.csv.getCsvFunction(csv, chart.config.categories);

      // Cateorize all data in csv.
      var catMap = {};
      var catNum = 0;

      csv.data.forEach(function (row, ri) {
        row.forEach(function (col, ci) {
          var category = categorize(csv, ri, ci);
          if (typeof catMap[category] == "undefined") {
            catMap[category] = catNum;
            catNum++;
          }
        });
      });
      var categories = Object.keys(catMap).map(function (key) {
        return {name: key};
      });

      csv.data.forEach(function (row, ri) {
        row.forEach(function (col, ci) {
          var category = catMap[categorize(csv, ri, ci)];
          var key = col + "::" + category;
          nodes[key] = nodes[key] || {
              id: nodeId++,
              name: col,
              symbolSize: 10,
              itemStyle: null,
              category: category,
              value: 0,
              draggable: true,
              label: {normal: {show: true}}
            };
          nodes[key].value++;
          nodes[key].symbolSize += 5;
        });
      });

      var links = [];

      var linkId = 0;
      csv.data.forEach(function (row, ri) {
        row.forEach(function (col, ci) {
          if (ci < (row.length - 1)) {
            var sourceCat = catMap[categorize(csv, ri, ci)];
            var targetCat = catMap[categorize(csv, ri, ci + 1)];

            links.push({
              id: linkId,
              source: nodes[row[ci] + "::" + sourceCat]["id"],
              target: nodes[row[ci + 1] + "::" + targetCat]["id"]
            });
            linkId++;
          }
        });
      });

      options.legend = {
        //selectedMode: 'single',
        orient: 'vertical',
        left: true,
        top: true,
        show: true,
        data: categories
      };

      options.series = dex.config.expandAndOverlay(chart.config.series,
        {
          name: "series",
          type: 'graph',
          layout: 'circular',

          lineStyle: {
            normal: {
              color: 'source',
              curveness: 0.3
            }
          },
          links: links,
          data: Object.keys(nodes).map(function (key) {
            return nodes[key];
          }),
          categories: categories,
          roam: true,
          label: {
            normal: {
              position: 'right',
              formatter: '{b}'
            }
          }
        });

      //dex.console.log("OPTIONS", options);
      return options;
    }

    function getTimelineOptions(csv) {

      // Dynamically determine our categorization function:
      var getCategory = dex.csv.getRowFunction(csv, chart.config.categories);
      var getSequence = dex.csv.getRowFunction(csv, chart.config.sequences);

      // Cateorize all data in csv.
      var catMap = {};
      var seqMap = {};
      var category;
      var sequence;

      csv.data.forEach(function (row, ri) {
        category = getCategory(row, ri);
        sequence = getSequence(row, ri);

        //dex.console.log("CAT", category, "SEQ", sequence);

        catMap[category] = 1;

        if (typeof seqMap[sequence] == "undefined") {
          seqMap[sequence] = {};
        }

        seqMap[sequence][category] = row;
      });

      var categories = Object.keys(catMap).sort();
      var sequences = Object.keys(seqMap).sort();

      var baseData = [];

      // Fill in gaps of data, carry down most recent data
      // entry, or first encountered if there is none yet.

      var curSeq = {};
      sequences.forEach(function (seq) {
        categories.forEach(function (cat) {
          if ((typeof seqMap[seq][cat]) == "undefined") {
            if ((typeof curSeq[cat]) == "undefined") {
              seqMap[seq][cat] = [0, 0, 0, cat, seq];
            }
            else {
              seqMap[seq][cat] = curSeq[cat];
            }
          }
          curSeq[cat] = seqMap[seq][cat];
        });
      });

      categories.forEach(function (cat) {
        baseData.push(seqMap[sequences[0]][cat]);
      });
      dex.console.log("BASE-DATA", baseData);

      var options = {
        "baseOption": {
          "timeline": {
            "axisType": "category",
            "orient": "vertical",
            "autoPlay": true,
            "inverse": true,
            "playInterval": 1000,
            "left": null,
            "right": 20,
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
            "lineStyle": {"color": "#555"},
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
            "data": sequences
          },
          "backgroundColor": "#404a59",
          "title": [{
            "text": 1800,
            "textAlign": "center",
            "left": "63%",
            "top": "55%",
            "textStyle": {"fontSize": 100, "color": "rgba(255, 255, 255, 0.7)"}
          }],
          "tooltip": {
            "padding": 5,
            "backgroundColor": "#222",
            "borderColor": "#777",
            "borderWidth": 1,
            formatter: function (obj) {
              //dex.console.log("OBJECT", obj);
              return "<table>" +
                "<tr><td>" + csv.header[3] + ": </td><td>" + obj.data[3] + "</td></tr>" +
                "<tr><td>" + csv.header[4] + ": </td><td>" + obj.data[4] + "</td></tr>" +
                "<tr><td>" + csv.header[0] + ": </td><td>" + obj.data[0] + "</td></tr>" +
                "<tr><td>" + csv.header[1] + ": </td><td>" + obj.data[1] + "</td></tr>" +
                "<tr><td>" + csv.header[2] + ": </td><td>" + obj.data[2] + "</td></tr>" +
                "</table>";
            }
          },
          "grid": {
            "left": "12%",
            "right": "110"
          },
          "xAxis": {
            "type": "value",
            "name": csv.header[0],
            "max": dex.csv.extent(csv, [0])[1],
            "min": dex.csv.extent(csv, [0])[0],
            "nameGap": 25,
            "nameLocation": "middle",
            "nameTextStyle": {"fontSize": 18},
            "splitLine": {"show": false},
            "axisLine": {"lineStyle": {"color": "#ccc"}},
            "axisLabel": {"formatter": "{value}"}
          },
          "yAxis": {
            "type": "value",
            "name": csv.header[1],
            "max": dex.csv.extent(csv, [1])[1],
            "nameTextStyle": {"color": "#ccc", "fontSize": 18},
            "axisLine": {"lineStyle": {"color": "#ccc"}},
            "splitLine": {"show": false},
            "axisLabel": {"formatter": "{value}"}
          },
          "visualMap": [{
            "show": false,
            "dimension": 3,
            "categories": categories,
            "calculable": true,
            "precision": 0.1,
            "textGap": 30,
            "textStyle": {"color": "#ccc"},
            "inRange": {"color": ["#bcd3bb", "#e88f70", "#edc1a5", "#9dc5c8", "#e1e8c8", "#7b7c68", "#e5b5b5", "#f0b489", "#928ea8", "#bda29a", "#bcd3bb", "#e88f70", "#edc1a5", "#9dc5c8", "#e1e8c8", "#7b7c68", "#e5b5b5", "#f0b489", "#928ea8", "#bda29a"]}
          }],
          "series": [{
            "type": "scatter",
            "itemStyle": {
              "normal": {
                "opacity": 0.8,
                "shadowBlur": 10,
                "shadowOffsetX": 0,
                "shadowOffsetY": 0,
                "shadowColor": "rgba(0, 0, 0, 0.5)"
              }
            },
            "data": baseData
          }],
          "animationDurationUpdate": 1000,
          "animationEasingUpdate": "quinticInOut"
        },
        options: []
      };

      sequences.forEach(function (seq) {
        var option = {
          "title": {
            show: true,
            text: seq
          }
        };
        var data = [];
        categories.forEach(function (cat) {
          data.push(seqMap[seq][cat]);
        });
        option.series = dex.config.expandAndOverlay(chart.config.series,
          {
            name: +seq,
            type: 'scatter',
            data: data,
            symbolSize: function (row) {
              //dex.console.log("SIZE OF", row);
              if (typeof row == "undefined") {
                return chart.config.radius.min;
              }
              //return 10;
              var size = chart.config.sizes(row);
              if (typeof size == "undefined" || size < 0) {
                return chart.config.radius.min;
              }
              else {
                return size;
              }
            }
          });
        option.series.type = 'scatter';
        options.options.push(option);
      });

      return options;
    }

    $(document).ready(function () {
      // Make the entire chart draggable.
      if (chart.config.draggable) {
        $(chart.config.parent).draggable();
      }
    });

    return chart;
  }
;

module.exports = echart;