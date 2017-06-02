var echart = function (userConfig) {
  var chart;
  var internalChart;
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

    d3.select(config.parent).selectAll("*").remove();
    //d3.select(config.parent)
    //  .attr("_echarts_instance_", null);

    if (typeof internalChart != "undefined") {
      internalChart.dispose();
    }
    internalChart = echarts.init(d3.select(config.parent)[0][0]);

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
    var seriesType = dex.object.getValue(chart.config, "series.type", "line");

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
      default:
        return getCartesianOptions(csv);
    }
  }

  function getPolarOptions(csv) {
    var options = {};
    //var gtypes = dex.csv.guessTypes(csv);
    options.legend = {data: csv.header};
    var xdata = [];
    csv.data.forEach(function (row, i) {
      xdata.push(i + 1);
    });

    options.angleAxis = {type: 'value', startAngle: 0};
    options.radiusAxis = {};
    options.polar = {};

    options.series = [];

    var frames;

    // If only 2 columns, then we have only 1 frame.
    if (csv.header.length <= 2) {
      frames = {frameIndices: ["line"], frames: [csv]};
    }
    // Frame by first column:
    //
    // REM: We need more sophisticated framing strategies for this.
    //  EX: Frame 2 column by index.
    else {
      frames = dex.csv.getFramesByIndex(csv, 0);
    }
    options.legend = {data: frames.frameIndices};
    dex.console.log("FRAMES", frames);

    frames.frames.forEach(function (frame, fi) {
      var series = dex.config.expandAndOverlay(chart.config.series,
        {
          coordinateSystem: 'polar',
          name: frames.frameIndices[fi],
          type: 'line',
          data: frame.data
        });
      options.series.push(series);
    });

    //dex.console.log("OPTIONS", options);
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
};

module.exports = echart;