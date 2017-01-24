var bubblechart = function (userConfig) {
  d3 = dex.charts.d3.d3v3;
  var chart;

  var defaults = {
    'parent': '#EChartParent',
    'id': 'EChartId',
    'class': 'EChartClass',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'title' : 'Title',
    'width': "100%",
    'height': "100%"
  };

  var config1 = dex.config.expandAndOverlay(
    userConfig, defaults);

  var config2 = { 'options' : {
    title: {
      text: config1.title
    },
    legend: {
      right: 10,
      data: config1.csv.header
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      scale: true
    },
    series: [{
      name: config1.csv.header[0],
      data: config1.csv.data[0],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 5e2;
      },
      label: {
        emphasis: {
          show: true,
          formatter: function (param) {
            return param.data[3];
          },
          position: 'top'
        },
        normal: {
          textStyle: {
            color: 'black'
          }
        }
      },
      itemStyle: {
        normal: {
          shadowBlur: 10,
          shadowColor: 'rgba(120, 36, 50, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            offset: 0,
            color: 'rgb(251, 118, 123)'
          }, {
            offset: 1,
            color: 'rgb(204, 46, 72)'
          }])
        }
      }
    }, {
      name: config1.csv.header[1],
      data: config1.csv.data[1],
      type: 'scatter',
      symbolSize: function (data) {
        return Math.sqrt(data[2]) / 5e2;
      },
      label: {
        emphasis: {
          show: true,
          formatter: function (param) {
            return param.data[3];
          },
          position: 'top'
        },
        normal: {
          textStyle: {
            color: 'black'
          }
        }
      },
      itemStyle: {
        normal: {
          shadowBlur: 10,
          shadowColor: 'rgba(25, 100, 150, 0.5)',
          shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
            offset: 0,
            color: 'rgb(129, 227, 238)'
          }, {
            offset: 1,
            color: 'rgb(25, 183, 207)'
          }])
        }
      }
    }]
  }};

  var chart = new dex.component(config1, config2);
  var internalChart;

  chart.render = function render() {
    d3 = dex.charts.d3.d3v3;
    var config = chart.config;
    var csv = config.csv;

    //d3.select(config.parent).selectAll("*").remove();

    dex.console.log("CSV", csv, "KI",
      dex.csv.createMap(csv, [0]));

    internalChart = echarts.init(d3.select(config.parent)[0][0]);
    internalChart.setOption(config.options);
    chart.resize();

    return chart;
  };

  chart.update = function () {
    //d3 = dex.charts.d3.d3v3;
    internalChart.resize();
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = bubblechart;